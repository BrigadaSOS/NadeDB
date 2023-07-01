import path from "path";
import { Media } from "../models/media/media";
import { Season } from "../models/media/season";
import { Episode } from "../models/media/episode";
import { Segment } from "../models/media/segment";
import { Category } from "../models/media/category";

const fs = require("fs");
const csv = require("csv-parser");

// Añade el contenido indispensable para el funcionamiento de la base de datos
export async function addBasicData(db: any) {
  await db.Category.create({
    name: "Anime",
  });

  await db.Category.create({
    name: "Book",
  });
}

// Función que lee todos los directorios y los mapea en la base de datos
export async function readAnimeDirectories(baseDir: string) {
  const animeDirectories = fs.readdirSync(baseDir);

  for (const animeItem of animeDirectories) {
    const animeDirPath = path.join(baseDir, animeItem);
    // Antes de crear el MEDIA, debe verificar la existencia de un archivo JSON con la info
    const dataJsonPath = path.join(animeDirPath, "info.json");
    const dataJsonExists = fs.existsSync(dataJsonPath);

    let media_raw = null;

    if (dataJsonExists) {
      try {
        const jsonString = fs.readFileSync(dataJsonPath);
        media_raw = JSON.parse(jsonString);
      } catch (error) {
        console.log("Error reading JSON file:", error);
      }

      try {
        let media = await Media.create(
          {
            english_name: media_raw.english_name,
            japanese_name: media_raw.japanese_name,
            folder_media_name: media_raw.folder_media_name,
            id_category: 1,
          },
          { include: Category }
        );

        await media.save();
      } catch (error) {
        console.log("Error creating media:", error);
      }
    }

    if (fs.statSync(animeDirPath).isDirectory()) {
      const seasonDirectories = fs
        .readdirSync(animeDirPath, { withFileTypes: true })
        .filter((dirent: { isDirectory: () => any }) => dirent.isDirectory())
        .map((dirent: { name: any }) => dirent.name);

      for (const seasonDirname of seasonDirectories) {
        const tempDirPath = path.join(animeDirPath, seasonDirname);

        let media = await Media.findOne({
          where: { english_name: media_raw.english_name },
          include: [Season, Category],
        });

        const number_season = parseInt(seasonDirname.replace("S", ""));

        if (media) {
          let season = await Season.create({
            mediaId: media.id,
            number: number_season,
          });

          await season.save();
        }

        if (fs.statSync(tempDirPath).isDirectory()) {
          const episodeDirectories = fs.readdirSync(tempDirPath);

          for (const episodeDirname of episodeDirectories) {
            const episodeDirPath = path.join(tempDirPath, episodeDirname);

            let season = await Season.findOne({
              where: {
                mediaId: media?.id,
                number: number_season,
              },
              include: [Episode],
            });

            let number_episode = parseInt(episodeDirname.replace("E", ""));

            let episode: Episode | null = null;

            if (season) {
              episode = await Episode.create({
                seasonId: season?.id,
                number: number_episode,
              });

              await episode.save();
            }

            const dataCsvPath = path.join(episodeDirPath, "data.csv");
            const dataCsvExists = fs.existsSync(dataCsvPath);

            if (dataCsvExists) {
              console.log("Anime data has been found: ", dataCsvPath);
              const rows = [];

              const stream = fs
                .createReadStream(dataCsvPath)
                .pipe(csv({ separator: ";" }));

              for await (const row of stream) {
                rows.push(row);
              }

              // Realizar inserciones en lotes
              const batchSize = 100;
              const batchCount = Math.ceil(rows.length / batchSize);

              for (let i = 0; i < batchCount; i++) {
                const start = i * batchSize;
                const end = start + batchSize;
                const batchRows = rows.slice(start, end);

                await insertSegments(batchRows, episode);
              }
            }
          }
        }
      }
    }
  }
}

// Función que lee un directorio en especifico y lo mapea en la base de datos
export async function readSpecificDirectory(
  baseDir: string,
  folder_name: string,
  season: string,
  episode: string,
  force: boolean
) {
  // Define la busqueda del anime en la base de datos
  const animeDirPath = path.join(baseDir, folder_name);

  let include:
    | {
        model: typeof Season;
        where: { number: string };
        include: { model: typeof Episode; where: { number: string } }[];
      }[]
    | { model: typeof Season; where: { number: string } }[] = [];
  if (season && episode) {
    include = [
      {
        model: Season,
        where: { number: season },
        include: [
          {
            model: Episode,
            where: { number: episode },
          },
        ],
      },
    ];
  } else if (season && !episode) {
    include = [
      {
        model: Season,
        where: { number: season },
      },
    ];
  }

  let animeFound = null;
  // Verifica si el contenido multimedia existe en el backend
  if (folderExists(animeDirPath)) {
    // Verifica si existe el anime en la base de datos

    animeFound = await Media.findOne({
      where: { english_name: folder_name },
      include: include,
    });

    // Si encuentra el anime, empieza a actualizar de acuerdo a los parametros
    // Caso contrario, lo añade a la base de datos
    if (animeFound) {
      if (force) {
        // Si solo se recibe la temporada, se fuerza la actualización en toda la temporada
        // Si se recibe la temporada y el episodio, se fuerza la actualización de un episodio en especifico de esa temporada
        // Si se recibe solo el episodio, no se hace nada
        // Si no recibe ningún parametro, se fuerza una actualización total del contenido
        if (season && !episode) {
          await Season.destroy({
            where: { mediaId: animeFound.id, number: season },
          });
        } else if (season && episode) {
          await Episode.destroy({
            where: { mediaId: animeFound.id, number: episode },
          });
        } else if (!season && episode) {
          return "You must specify a season to delete an episode.";
        } else if (!season && !episode) {
          await animeFound.destroy();
          try {
            await fullSyncSpecificAnime(animeFound, folder_name, animeDirPath);
            return "Anime has been added to the database.";
          } catch (error) {
            return error;
          }
        }
      } else {
        return "Anime already exists in the database. If you want to force an update, please check the force option.";
      }
    } else {
      try {
        await fullSyncSpecificAnime(animeFound, folder_name, animeDirPath);
        return "Anime has been added to the database.";
      } catch (error) {
        return error;
      }
    }
  } else {
    return "Anime folder does not exist. Check the name of the folder and try again.";
  }
}

async function fullSyncSpecificAnime(
  animeFound: Media | null,
  folder_name: string,
  animeDirPath: string
) {
  try {
    animeFound = await Media.create(
      {
        english_name: folder_name,
        id_category: 1,
      },
      { include: Category }
    );
    await animeFound.save();
    console.log("Media info inserted into the database.");
  } catch (error) {
    console.error("Error while inserting media info into the database:", error);
  }

  // Lee cada temporada y empieza a mapearla en la base de datos
  const seasonDirectories = fs
    .readdirSync(animeDirPath, { withFileTypes: true })
    .filter((dirent: { isDirectory: () => any; }) => dirent.isDirectory())
    .map((dirent: { name: any; }) => dirent.name);

  for (const seasonDirname of seasonDirectories) {
    const number_season = parseInt(seasonDirname.replace("S", ""));
    let season = await Season.create({
      mediaId: animeFound!.id,
      number: number_season,
    });
    await season.save();

    // Una vez mapeada la temporada, mapea los episodios
    const tempDirPath = path.join(animeDirPath, seasonDirname);
    if (fs.statSync(tempDirPath).isDirectory()) {
      const episodeDirectories = fs.readdirSync(tempDirPath);
      for (const episodeDirname of episodeDirectories) {
        const number_episode = parseInt(episodeDirname.replace("E", ""));

        let episode = await Episode.create({
          seasonId: season?.id,
          number: number_episode,
        });
        await episode.save();

        // Una vez mapeado el episodio, mapea los segmentos de acuerdo al archivo CSV dentro de la carpeta del episodio
        const episodeDirPath = path.join(tempDirPath, episodeDirname);
        const dataCsvPath = path.join(episodeDirPath, "data.csv");
        const dataCsvExists = fs.existsSync(dataCsvPath);

        if (dataCsvExists) {
          console.log("Anime data has been found: ", dataCsvPath);
          const rows = [];

          const stream = fs
            .createReadStream(dataCsvPath)
            .pipe(csv({ separator: ";" }));

          for await (const row of stream) {
            rows.push(row);
          }

          // Realizar inserciones en lotes a la base de datos para no atascar el servicio
          const batchSize = 100;
          const batchCount = Math.ceil(rows.length / batchSize);

          for (let i = 0; i < batchCount; i++) {
            const start = i * batchSize;
            const end = start + batchSize;
            const batchRows = rows.slice(start, end);
            await insertSegments(batchRows, episode);
          }
        }
      }
    }
  }
}

// Funciones menores

function folderExists(path: string) {
  try {
    fs.statSync(path);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") {
      return false;
    } else {
      throw err;
    }
  }
}

async function insertSegments(rows: any[], episode: Episode | null) {
  await Promise.all(
    rows.map(async (row: any) => {
      if (episode) {
        let segment = await Segment.create({
          start_time: row.START_TIME,
          end_time: row.END_TIME,
          position: row.POSITION,
          content: row.CONTENT,
          content_english: row.CONTENT_TRANSLATION_ENGLISH,
          content_english_mt: row.CONTENT_ENGLISH_MT,
          content_spanish: row.CONTENT_TRANSLATION_SPANISH,
          content_spanish_mt: row.CONTENT_SPANISH_MT,
          path_image: row.NAME_SCREENSHOT,
          path_audio: row.NAME_AUDIO,
          episodeId: episode.id,
        });

        await segment.save();
      }
    })
  );
}
