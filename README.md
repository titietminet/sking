# sking

Un prototype Next.js pour explorer des recommandations de skis et de fixations à partir du profil et du budget du skieur.

## Démarrer

### Installer les dépendances

Node.js et Python 3.11 ou 3.12 sont nécessaires. À la racine du projet, créez un environnement Python et installez les paquets :

```powershell
& "$env:LocalAppData\Programs\Python\Python312\python.exe" -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r service\requirements.txt
$env:Path = "C:\Program Files\nodejs;$env:Path"
npm.cmd install
```

### Entraîner le modèle

L’entraînement génère `models\ski_length.joblib` et ses métriques. Ces fichiers restent locaux et ne sont pas commités.

```powershell
python -m service.train_model
```

Les erreurs affichées sont calculées sur le jeu synthétique produit par le script, pas sur des données de skieurs réels.

### Lancer le site et le moteur IA

Dans un premier terminal, démarrez l’API :

```powershell
.\.venv\Scripts\Activate.ps1
python -m uvicorn service.api:app --reload --port 8000
```

Dans un second terminal, démarrez Next.js :

```powershell
$env:Path = "C:\Program Files\nodejs;$env:Path"
npm.cmd run dev
```

Ouvrir ensuite [http://localhost:3000](http://localhost:3000).

Le formulaire envoie la taille, le poids, le niveau, le terrain et le budget au modèle LightGBM, qui estime une longueur de ski puis classe les produits du catalogue. Les modèles et associations ski/fixation affichés restent des exemples de démonstration. Les données synthétiques servent uniquement à valider le branchement technique : elles ne permettent pas de mesurer la qualité des conseils pour de vrais skieurs. Avant une mise en production, remplacez-les par des recommandations validées par des professionnels et un catalogue fiable. La longueur de semelle doit être vérifiée par un atelier pour le réglage des fixations.
