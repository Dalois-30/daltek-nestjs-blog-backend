import { S3Client, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = "us-east-1";
const BUCKET_NAME = "blogdalois";
const PREFIX = "photo/";

const s3 = new S3Client({ region: REGION });

async function listImageUrls() {
  try {
    const command = new ListObjectsCommand({
      Bucket: BUCKET_NAME,
      Prefix: PREFIX,
    });
    const result = await s3.send(command);
    const urls = result.Contents?.map(
      (object) =>
        `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${object.Key}`
    );
    console.log(urls);
  } catch (error) {
    console.error(error);
  }
}

listImageUrls();

async function getSignedImageUrls() {
  const s3 = new S3Client({ region: REGION });

  try {
    // Récupérer la liste de tous les objets / images dans votre dossier.
    const listObjectsCommand = new ListObjectsCommand({ Bucket: BUCKET_NAME, Prefix: PREFIX });
    const listObjectsResult = await s3.send(listObjectsCommand);

    // Obtenir les préfixes pour chaque objet
    const contents = listObjectsResult.Contents || [];

    // Créer une liste d'URL signées pour chaque objet
    const presignedUrls = await Promise.all(contents.map(async (object) => {
      // Obtenir les paramètres d'URL pour l'objet
      const urlParams = {
        Bucket: BUCKET_NAME,
        Key: object.Key
      };

      // Obtenir une URL signée pour l'objet
      const getCommand = new GetObjectCommand(urlParams);
      const presignedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

      return presignedUrl;
    }));

    console.log(presignedUrls);
    return presignedUrls;
  } catch (err) {
    console.log('Error', err);
    return [];
  }
}

getSignedImageUrls();

