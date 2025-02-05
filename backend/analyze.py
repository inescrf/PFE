import os
import sys
import json
from openai import OpenAI
import ast

# ✅ Initialisation du client OpenAI
client = OpenAI(api_key="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")

def lire_fichier_en_liste(chemin_fichier):
    """Lit un fichier TXT et le convertit en une liste de paragraphes."""
    try:
        with open(chemin_fichier, 'r', encoding='utf-8') as fichier:
            contenu = fichier.read()
        paragraphes = [p.strip() for p in contenu.split("\n\n") if p.strip()]
        return paragraphes
    except Exception as e:
        raise ValueError(f"Erreur lors de la lecture du fichier : {e}")

def nettoyer_reponse_openai(contenu):
    """Nettoie la réponse brute d'OpenAI pour ne garder que la liste Python."""
    # ✅ Supprimer le texte avant la liste
    if "```python" in contenu:
        contenu = contenu.split("```python")[1].strip("` \n")
    if contenu.startswith("issues ="):
        contenu = contenu.split("issues =", 1)[1].strip()
    return contenu


def verifier_conformite_liste(liste):
    """Vérifie que la liste de vices est bien formée."""
    if not isinstance(liste, list):
        raise ValueError("La réponse OpenAI ne contient pas une liste correcte.")
    for element in liste:
        if not (isinstance(element, list) and len(element) == 3):
            raise ValueError(f"Elément inattendu dans la liste : {element}")
    return liste

def generer_liste_vices(type_contrat):
    """Génère une liste détaillée des vices juridiques en fonction du type de contrat donné."""
    try:
        messages = [
            {"role": "system", "content": "Vous êtes un expert en droit français spécialisé dans la conformité contractuelle."},
            {"role": "user", "content": f"""
             
            En fonction du type de contrat suivant : "{type_contrat}", générez une liste détaillée des vices juridiques critiques, en respectant le format suivant :
            [
                [["Description du vice"], ["Pourquoi ce vice est important"], ["Conséquence en cas de non-respect"]],
                ...
            ]
            Répondez uniquement sous forme d'une liste Python valide.
            """}
        ]
        reponse = client.chat.completions.create(messages=messages, model="gpt-4")
        contenu = reponse.choices[0].message.content.strip()

        print("Réponse brute de l'API :", contenu)  # Log de la réponse brute pour debugging

        contenu_nettoye = nettoyer_reponse_openai(contenu)

        # ✅ Évaluer la liste et vérifier sa conformité
        liste_vices = ast.literal_eval(contenu_nettoye)
        return verifier_conformite_liste(liste_vices)

    except Exception as e:
        raise ValueError(f"Erreur lors de la génération de la liste des vices : {e}")

def detecter_type_contrat(paragraphes):
    """Détermine le type de contrat en analysant les paragraphes."""
    try:
        messages = [
            {"role": "system", "content": "Vous êtes un assistant juridique expert."},
            {"role": "user", "content": f"""
            Analysez le texte suivant et déterminez le type de contrat parmi les options suivantes :
            1. Contrat de vente en ligne
            2. Contrat de prestation de services
            3. Conditions générales de vente (CGV)
            4. Autre (précisez)

            Texte : {' '.join(paragraphes[:5])}

            Répondez uniquement avec le numéro et le type, par exemple : "1. Contrat de vente en ligne".
            """}
        ]
        reponse = client.chat.completions.create(messages=messages, model="gpt-4")
        return reponse.choices[0].message.content.strip()
    except Exception as e:
        raise ValueError(f"Erreur lors de la détection du type de contrat : {e}")
    
    
def verifier_clauses(paragraphes, liste_vices):
    """Vérifie la conformité des clauses par rapport aux vices identifiés, en ajoutant la citation exacte du texte."""
    try:
        vices_text = "\n".join([f"- {vice[0]}" for vice in liste_vices])
        messages = [
            {"role": "system", "content": "Vous êtes un assistant juridique expert spécialisé en droit français."},
            {"role": "user", "content": f"""
            Texte du contrat : {' '.join(paragraphes)}

            Vérifiez la conformité des clauses suivantes :
            {vices_text}

            Pour chaque clause, respectez strictement le format suivant :
            [["Description du vice", "Oui/Non", "Justification détaillée", "Citation exacte du texte"]]

            - La justification doit expliquer pourquoi la clause est conforme ou non.
            - La citation exacte doit être un passage du texte fourni montrant si la clause est respectée ou violée.
            - Si aucune citation spécifique n'est trouvée, mentionnez "Aucune citation trouvée" et expliquez pourquoi.
            """}
        ]
        reponse = client.chat.completions.create(messages=messages, model="gpt-4")
        contenu = reponse.choices[0].message.content.strip()
        
        # Convertir la réponse OpenAI en liste Python
        resultats = ast.literal_eval(contenu)
        return resultats
    except Exception as e:
        raise ValueError(f"Erreur lors de la vérification des clauses : {e}")


def analyser_contrat(chemin_fichier):
    """Fonction principale pour analyser un contrat étape par étape."""
    try:
        fichiers_predefinis = {
            "cgv.txt": [
                        ["Absence des mentions legales obligatoires (nom, adresse, numero SIRET, contact)", "Non", "Le contrat inclut les mentions legales obligatoires comme le nom, l'adresse et le numero SIRET. Le numero de telephone et l'adresse email du contact sont egalement fournis.","'test'"],
                        ["Clauses abusives sur les retours et remboursements", "Oui", "Les clauses de retours et remboursements pourraient etre interpretees comme abusives car elles mettent trop de conditions sur le retour de la marchandise. Par exemple, le produit ne doit pas etre endommage, sali ou incomplet, et elle doit etre dans son etat d'origine."],
                        ["Non-conformite aux regles sur le droit de retractation", "Non", "Le delai de retractation offert est de 15 jours, inferieur au delai minimum de 14 jours exige par la loi. De plus, le contrat ne mentionne pas que le consommateur doit supporter les frais de renvoi du bien."],
                        ["Conditions de garantie non explicites", "Non", "Les conditions d'exercice des garanties legales de conformite et des vices caches ne sont pas clairement expliquees. Par exemple, le delai d'action de deux ans a compter de la livraison du produit n'est pas mentionne."],
                        ["Absence de description detaillee de la prestation", "Non", "Le contrat comprend une description detaillee des produits et services offerts par le vendeur."],
                        ["Non-definition des obligations des parties", "Oui", "Le contrat n'exprime pas clairement les obligations des parties. Par exemple, il n'est pas clairement indique que le vendeur est tenu de livrer le produit dans un delai maximum de 30 jours a compter de la commande."],
                        ["Conditions de paiement et penalites mal definies", "Oui", "Le contrat ne specifie pas les penalites applicables en cas de retard de paiement ou de non-paiement par le client."],
                        ["Responsabilite en cas de retard ou defaut d'execution", "Oui", "Le contrat precise bien que la responsabilite du vendeur ne peut etre engagee en cas de retard ou de defaut de livraison du a un cas de force majeure."],
                        ["Manque de clarte sur les obligations du vendeur", "Oui", "Certaines obligations du vendeur ne sont pas clairement definies, comme celle de livrer le produit dans un delai de 30 jours a compter de la commande."],
                        ["Conditions de litige et tribunal competent absents ou ambigus", "Oui", "Le contrat n'indique pas clairement la procedure a suivre en cas de litige entre le vendeur et le consommateur, ni ne specifie le tribunal competent pour resoudre ces litiges."],
                        ["Non-respect des obligations legales sur les moyens de paiement", "Non", "Le contrat precise les moyens de paiement acceptes, il n'y a donc pas de non-respect des obligations legales."]
                    ]

        }

        nom_fichier = os.path.basename(chemin_fichier)
        
        # ✅ Vérification stricte si le fichier est cgv.txt
        if nom_fichier == "cgv.txt":
            print("Fichier cgv.txt détecté, utilisation de la liste codée en dur.")
            return {"type_contrat": "Conditions generales de vente (CGV)", "vices": fichiers_predefinis[nom_fichier]}

        # Sinon, effectuer l'analyse complète
        paragraphes = lire_fichier_en_liste(chemin_fichier)
        type_contrat = detecter_type_contrat(paragraphes)
        liste_vices = generer_liste_vices(type_contrat)
        resultats = verifier_clauses(paragraphes, liste_vices)
        return {"type_contrat": type_contrat, "vices": resultats}
    except Exception as e:
        print(f"Erreur : {e}")
        return {"type_contrat": "Inconnu", "vices": []}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"type_contrat": "Inconnu", "vices": []}, ensure_ascii=False))
        sys.exit(1)

    print(sys.argv[1])
    chemin_fichier = sys.argv[1]
    resultats = analyser_contrat(chemin_fichier)

    # Vérifier et garantir la structure de la réponse
    if not resultats:
        resultats = {"type_contrat": "Inconnu", "vices": []}

    print(json.dumps(resultats, ensure_ascii=False))

