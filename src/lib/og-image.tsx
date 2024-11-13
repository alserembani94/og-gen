import satori from 'satori';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from './r2';
import sharp from 'sharp';

export async function generateOGImage(title: string, description: string, existingKey?: string) {
  const svg = await satori(
    <div style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundImage: 'url("https://i.imgur.com/L5DN878.jpeg")',
      padding: 40,
    }}>
      <h1 style={{
        fontSize: 60,
        fontWeight: 'bold',
        color: '#1a1a1a',
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: 24,
        color: '#1a1a1a',
        marginTop: 20,
      }}>
        {description}
      </p>
    </div>,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          name: 'Roboto',
          // Using TTF format instead of WOFF2
          data: await fetch(
            'https://github.com/googlefonts/roboto/raw/main/src/hinted/Roboto-Regular.ttf'
          ).then((res) => res.arrayBuffer()),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Roboto',
          // Bold version
          data: await fetch(
            'https://github.com/googlefonts/roboto/raw/main/src/hinted/Roboto-Bold.ttf'
          ).then((res) => res.arrayBuffer()),
          weight: 700,
          style: 'normal',
        }
      ]
    },
  );

  const img = await sharp(Buffer.from(svg))
    .png()
    .toBuffer()

  const key = existingKey || `og-images/${Date.now()}.png`;
  
  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: img,
      ContentType: 'image/png',
    })
  );

  return {
    url: `https://${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`,
    key: key
  };
}