from .model import train_and_save


if __name__ == "__main__":
    metrics = train_and_save()
    print("Évaluation sur données synthétiques uniquement :")
    print(f"Erreur absolue moyenne (test) : {metrics['test_mae_cm']} cm")
    print(f"Erreur absolue moyenne (validation croisée) : {metrics['cross_validation_mae_cm']} cm")
    print(f"Écart-type en validation croisée : {metrics['cross_validation_std_cm']} cm")
    print(f"Modèle entraîné sur {metrics['dataset_size']} profils synthétiques.")
