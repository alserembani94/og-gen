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
    }}>
      <p style={{ fontSize: 24, color: 'white' }}>Test</p>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 36 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png"
          alt="heyyo"
          style={{
            width: '84px',
            height: '120px',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            objectFit: 'contain',
            backgroundColor: "transparent",
            borderRadius: "50%",
          }}
        />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: '#ffffff',
          }}>
            {title}
          </h1>
          <p style={{
            fontSize: 16,
            color: '#ffffff'
          }}>
            {description}
          </p>
        </div>
      </div>
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