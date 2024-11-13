'use client';

export default function Page() {
  return (
    <div style={{
      display: 'flex',
      height: '400px',
      width: '600px',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundImage: 'url("https://i.imgur.com/L5DN878.jpeg")',
      padding: 40,
      gap: 12
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
            Name
          </h1>
          <p style={{
            fontSize: 16,
            color: '#ffffff'
          }}>
            Primary Contact: +6011-2345 6789
          </p>
        </div>
      </div>
    </div>
  );
}