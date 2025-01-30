import os
import sys
import json
from openai import OpenAI
import ast
from dotenv import load_dotenv  # ✅ Importation de dotenv

# ✅ Charger les variables d'environnement depuis un fichier .env
load_dotenv()

# ✅ Récupérer la clé API depuis les variables d'environnement
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Vérifier si la clé API est bien chargée
if not OPENAI_API_KEY:
    raise ValueError("Erreur : La clé API OpenAI n'est pas définie. Ajoutez-la dans un fichier .env.")

client = OpenAI(api_key=OPENAI_API_KEY)


def lire_fichier_en_liste(chemin_fichier):
    """Lit un fichier TXT et le convertit en une liste de paragraphes."""
    try:
        with open(chemin_fichier, 'r', encoding='utf-8') as fichier:
            contenu = fichier.read()
        paragraphes = [p.strip() for p in contenu.split("\n\n") if p.strip()]
        return paragraphes
    except Exception as e:
        return {"erreur": f"Erreur lors de la lecture du fichier : {e}"}


def detecter_type_contrat(paragraphes):
    """Utilise OpenAI pour déterminer le type de contrat."""
    try:
        messages = [
            {"role": "system", "content": "Vous êtes un assistant juridique expert."},
            {"role": "user", "content": f"""
            Analysez le texte suivant et déterminez le type de contrat parmi :
            - Contrat de vente en ligne
            - Contrat de prestation de services
            - Conditions générales de vente (CGV)
            - Autre (précisez)

            Texte : {' '.join(paragraphes[:5])}
            """}
        ]
        reponse = client.chat.completions.create(
            messages=messages,
            model="gpt-4",
        )
        return reponse.choices[0].message.content.strip()
    except Exception as e:
        return {"erreur": f"Erreur lors de la détection du type de contrat : {e}"}


def generer_liste_vices(type_contrat):
    """Génère une liste des vices juridiques en fonction du type de contrat."""
    try:
        messages = [
            {"role": "system", "content": "Vous êtes un expert en droit français."},
            {"role": "user", "content": f"""
            En fonction du type de contrat "{type_contrat}", listez les principaux vices juridiques sous ce format JSON :
            [
                ["Description du vice", "Pourquoi ce vice est important", "Conséquence en cas de non-respect"]
            ]
            """}
        ]
        reponse = client.chat.completions.create(
            messages=messages,
            model="gpt-4",
        )
        return ast.literal_eval(reponse.choices[0].message.content.strip())
    except Exception as e:
        return {"erreur": f"Erreur lors de la génération des vices : {e}"}


def analyser_contrat(chemin_fichier):
    """Fonction principale qui analyse un contrat et retourne un JSON valide."""
    try:
        paragraphes = lire_fichier_en_liste(chemin_fichier)
        if isinstance(paragraphes, dict) and "erreur" in paragraphes:
            return paragraphes

        type_contrat = detecter_type_contrat(paragraphes)
        if isinstance(type_contrat, dict) and "erreur" in type_contrat:
            return type_contrat

        liste_vices = generer_liste_vices(type_contrat)
        if isinstance(liste_vices, dict) and "erreur" in liste_vices:
            return liste_vices

        return {
            "type_contrat": type_contrat,
            "vices": liste_vices
        }
    except Exception as e:
        return {"erreur": f"Erreur lors de l'analyse : {e}"}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"erreur": "Aucun fichier fourni en argument"}))
        sys.exit(1)

    chemin_fichier = sys.argv[1]
    resultats = analyser_contrat(chemin_fichier)

    # ✅ Convertir en JSON pour éviter les erreurs de parsing dans Node.js
    print(json.dumps(resultats, ensure_ascii=False))
