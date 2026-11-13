export async function POST(request: Request) {
  let profile: unknown;
  try {
    profile = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Le profil envoyé n’est pas un JSON valide." }, { status: 400 });
    }
    throw error;
  }

  let response: Response;
  try {
    const apiUrl = process.env.RECOMMENDER_API_URL ?? "http://127.0.0.1:8000";
    response = await fetch(`${apiUrl}/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Le service Python de recommandation est indisponible.", error);
    return Response.json(
      { error: "Le moteur IA est indisponible. Démarrez le service Python sur le port 8000." },
      { status: 503 },
    );
  }

  const result = await response.json();
  return Response.json(result, { status: response.status });
}
