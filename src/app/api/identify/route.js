const { NextResponse } = require('next/server');
const hashInfo = require('../../../../description.json');

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No hash provided' }, { status: 400 });
    }

    const apiUrl = 'https://hashes.com/en/api/identifier';
    const response = await fetch(`${apiUrl}?hash=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (data.success && data.algorithms.length > 0) {
      let identifiedAlgorithm = data.algorithms[0].split(',')[0].trim();

      const algorithmMap = {
        "bcrypt $2*$": "Bcrypt",
        "Blowfish (Unix)": "Bcrypt",
        "MD5": "MD5",
        "SHA1": "SHA-1",
        "SHA256": "SHA-256",
        "SHA512": "SHA-512",
        "Base64 Encoded String": "Base64",
        "NTLM": "NTLM"
      };

      identifiedAlgorithm = algorithmMap[identifiedAlgorithm] || identifiedAlgorithm;

      const details = hashInfo[identifiedAlgorithm] || { Description: 'No additional information available' };

      return NextResponse.json({ algorithm: identifiedAlgorithm, details }, { status: 200 });
    }

    return NextResponse.json({ error: 'Algorithm not identified' }, { status: 404 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}
