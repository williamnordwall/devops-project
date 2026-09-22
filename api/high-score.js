const globalStore = globalThis.__jetswim_scoreboard__ || (globalThis.__jetswim_scoreboard__ = { bestScore: 0 });

module.exports = async function handler(request, response) {
  if (request.method === 'GET') {
    return response.status(200).json({ bestScore: Number(globalStore.bestScore || 0) });
  }

  if (request.method === 'POST') {
    const chunks = [];

    for await (const chunk of request) {
      chunks.push(chunk);
    }

    let payload = {};
    const rawBody = Buffer.concat(chunks).toString('utf8');

    try {
      payload = rawBody ? JSON.parse(rawBody) : {};
    } catch (error) {
      return response.status(400).json({ error: 'Invalid JSON body' });
    }

    const incomingScore = Number(payload.score || 0);
    if (!Number.isFinite(incomingScore) || incomingScore < 0) {
      return response.status(400).json({ error: 'score must be a non-negative number' });
    }

    if (incomingScore > Number(globalStore.bestScore || 0)) {
      globalStore.bestScore = incomingScore;
    }

    return response.status(200).json({ bestScore: Number(globalStore.bestScore || 0) });
  }

  return response.status(405).json({ error: 'Method not allowed' });
};
