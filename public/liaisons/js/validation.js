var validation = {
    //conserve la référence de l'élément de formulaire
    refFormulaire:null,
    //conserse le tableau des messages d'erreur
    tErreurs:[],
    //tableau des validités des champs
    tValide:[],

    noEtape:1,

     btnSuivant : document.getElementById('btnSuiv'),
   btnPrecedent:  document.getElementById('btnPrec'),
   btnConfirmer : document.getElementById('btnConf'),



    /**
     * Méthode d'initialisation de la validation du formulaire
     */
    initialiser: function(){

        //si le javascript et activé, la classe js est placée dans le body indiquant au CSS qu'il est actif
        document.body.className = "js";

        //obtient la référence de la balise <form> en utilisant la classe formulaire
        this.refFormulaire = document.querySelector(".form");
        // const btnSuivant = document.getElementById('btnSuiv');
        // const btnPrecedent = document.getElementById('btnPrec');
        // const btnConfirmer = document.getElementById('btnConf');

        //empêche la validation html quand il y a du javascript
        this.refFormulaire.setAttribute('novalidate', 'novalidate');

        //défini les écouteurs d'événement des boutons submit et reset
        this.refFormulaire.addEventListener('submit', this.validerFormulaire.bind(this));
        this.refFormulaire.addEventListener('reset', this.effacerFormulaire.bind(this));

        this.btnSuivant.addEventListener('click', this.changementEtape.bind(this));
        this.btnPrecedent.addEventListener('click', this.changementEtape.bind(this));
        this.btnConfirmer.addEventListener('click', this.changementEtape.bind(this));


        //défini les écouteurs blur des éléments de texte du formulaire
        this.refFormulaire.querySelector("#prenom").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#nom").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#mail").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#ville").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#adresse").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#codePost").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#numCarte").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#expCarte").addEventListener("blur", this.validerChampTexte.bind(this));
        this.refFormulaire.querySelector("#cvv").addEventListener("blur", this.validerChampTexte.bind(this));

        this.refFormulaire.querySelector("#pays").addEventListener("blur", this.validerSelect.bind(this));
        this.refFormulaire.querySelector("#province").addEventListener("blur", this.validerSelect.bind(this));

        this.refFormulaire.querySelector(".typeDon").addEventListener("blur", this.validerCheck.bind(this));
        this.refFormulaire.querySelector(".montantDon").addEventListener("blur", this.validerCheck.bind(this));
        this.refFormulaire.querySelector(".hommageDon").addEventListener("blur", this.validerCheck.bind(this));
        this.refFormulaire.querySelector(".freqDon").addEventListener("blur", this.validerCheck.bind(this));

        this.tValide["prenom"]=false;
        this.tValide["nom"]=false;
        this.tValide["mail"]=false;
        this.tValide["ville"]=false;
        this.tValide["adresse"]=false;
        this.tValide["codePost"]=false;
        this.tValide["pays"]=false;
        this.tValide["province"]=false;
        this.tValide["type--don"]=false;
        this.tValide["montant--don"]=false;
        this.tValide["hommage--don"]=false;
        this.tValide["freq--don"]=false;
        this.tValide["numCarte"]=false;
        this.tValide["expCarte"]=false;
        this.tValide["cvv"]=false;

        console.log("init "+ this.tErreurs);

    },

    chargeJSON: function(objJSON){
        //fonction fetch (chargement asynchrone du JSON)
        fetch(objJSON)
            .then(response => response.json()) //la prommesse retourne une réponse de type JSON
            .then(monJSON => this.tErreurs=monJSON); // une fois reçu, on stock le JSON dans la variable
    },

    /**
     * Méthode de validation des champs de texte
     * @param evenement
     */
    validerChampTexte: function(evenement){
        console.log("validerChampTexte "+  this.tErreurs);
        //champ invalide par défaut
        var valide=false;
        //objet du DOM déclancheur, initialise un objet jQuery
        var objCible=evenement.currentTarget;
        //retrouve le regexp de l'objet du DOM en lisant l'attribut pattern
        var strChaineExp=new RegExp(objCible.getAttribute('pattern'));
        //valide si pas vide
        if(this.validerSiVide(objCible)===true){
            //si vide, afficher le message d'erreur
            this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["vide"]);
        }else{
            if(objCible.hasAttribute("pattern")){
                //si pas vide, tester le pattern
                if (strChaineExp.test(objCible.value)) {
                    //si pattern ok
                    valide = true;
                    //effacer le champ d'erreur
                    this.effacerChampErreur(objCible);
                } else {
                    //si pattern invalide afficher message détaillé
                    this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["pattern"]);
                }
            }else{
                this.effacerChampErreur(objCible);
                valide = true;
            }
        }
        //modifier le tableau des validitées
        this.modifierTableauValidation(objCible.getAttribute("name"),valide);
    },

    validerSelect: function(evenement){
        console.log("validerChampTexte "+  this.tErreurs);
        //champ invalide par défaut
        var valide=false;
        //objet du DOM déclancheur, initialise un objet jQuery
        var objCible=evenement.currentTarget;

        if(this.validerSiSelected(objCible)===true){
            //si vide, afficher le message d'erreur
            this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["vide"]);
            console.log('rrfru')
        }else{
            valide = true;
            //effacer le champ d'erreur
            this.effacerChampErreur(objCible);
        }


    },

    validerCheck: function(evenement){
        console.log("validerChampTexte "+  this.tErreurs);
        //champ invalide par défaut
        var valide=false;
        //objet du DOM déclancheur, initialise un objet jQuery
        var objCible=evenement.currentTarget;

        if(this.validerSiChecked(objCible)===true){
            //si vide, afficher le message d'erreur
            this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["vide"]);
        }else{
            valide = true;
            //effacer le champ d'erreur
            this.effacerChampErreur(objCible);
        }


    },

    /**
     * Méthode de validation finale du formulaire et d'envoi
     * @param evenement
     */
    validerFormulaire: function(evenement){
        //Par defaut, le formulaire est considé comme valide
        var valide = true;
        //Pour chacun des champs présent dans le tableau de validation
        for(var champ in this.tValide ){
            //Si un champ est invalide
            if (this.tValide[champ] === false) {
                //cible l'objet du DOM fautif
                var objCible=this.refFormulaire.querySelector("#"+champ);
                //ici deux possibilité de message, vide ou pattern
                if(this.validerSiVide(objCible)===true){
                    this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["vide"]);
                }else{
                    if(objCible.hasAttribute("pattern")){
                        var strChaineExp=new RegExp(objCible.getAttribute('pattern'));
                        if(strChaineExp.test(objCible.value) ){
                            //affiche que l'entrée n'est pas du bon format
                            this.afficherChampErreur(objCible, this.tErreurs[objCible.getAttribute("name")]["pattern"]);
                        }
                    } else {
                        //effacer le champ d'erreur
                        this.effacerChampErreur(objCible);
                    }
                }
                //Le formulaire contient des champs invalide, et n'est donc pas prêt à l'envoi
                valide=false;
            }
        }

        // si le formulaire n'est pas valide, on annule la soumission du formulaire de l'événement submit
        if(valide === false){
            evenement.preventDefault();
        }
    },


    //Méthodes utilitaires**********************************
    /**
     * Méthode de validation de champs si vide
     * @param objCible
     * @returns {boolean}
     */
    validerSiVide: function(objCible){
        var valide = false; //false = champ vide
        if(objCible.value === ""){
            valide = true; //si false, champ contient quelque chose
        }
        return valide;
    },

    validerSiSelected: function(objCible){
        var valide = false; //false = champ vide
        if(objCible.value === "select"){
            valide = true; //si false, champ contient quelque chose
        }
        return valide;
    },

    validerSiChecked: function(objCible){
        var valide = false; //false = champ vide
        if(objCible.checked === false){
            valide = true; //si false, champ contient quelque chose
        }
        return valide;
    },

    /**
     * Méthode d'affichage des messages d'erreur
     * @param objCible
     * @param message
     */
    afficherChampErreur: function (objCible,message){
        var nom = "err_"+objCible.getAttribute("id");
        document.getElementById(nom).innerHTML=message;
        objCible.parentNode.classList.add("input__erreur");
    },

    /**
     * Méthode d'effacement des messages d'erreur
     * @param objCible
     */
    effacerChampErreur: function(objCible) {
        var nom = "err_"+objCible.getAttribute("id");
        document.getElementById(nom).innerHTML="";
        objCible.parentNode.classList.remove("input__erreur");
    },

    /**
     * Méthode de d'inscription de l'état des champs dans le tableau de validation
     * @param nomChamp
     * @param valide
     */
    modifierTableauValidation:function(nomChamp,valide){
        this.tValide[nomChamp]=valide;
    },

    /**
     * Méthode d'effacement des message d'erreur et de remise à zéro des champs du formulaire
     */
    effacerFormulaire: function(){
        var liste=document.querySelectorAll(".formulaire__erreur")
        liste.forEach(function(objetCible){
            objetCible.innerHTML="";
            objetCible.parentNode.classList.remove("input__erreur");
        });
        this.tValide["prenom"]=false;
        this.tValide["nom"]=false;
        this.tValide["mail"]=false;
        this.tValide["ville"]=false;
        this.tValide["codePost"]=false;
    },


    changementEtape:function(evenement){
        var objCible=evenement.currentTarget;
        console.log('debut' + this.noEtape);

        if(objCible.id === 'btnSuiv'){
            this.noEtape++;
            if(this.noEtape > 1){
                this.btnPrecedent.classList.remove('btn--cache');
                this.refFormulaire.querySelector('.step'+(this.noEtape-1)).classList.add('etatEtape');
                this.refFormulaire.querySelector('.step'+(this.noEtape)).classList.remove('etatEtape');
            }
            if(this.noEtape >= 4){
                this.btnSuivant.classList.add('btn--cache');
                this.btnConfirmer.classList.remove('btn--cache');
            }
        }else{
            this.noEtape--;
            this.refFormulaire.querySelector('.step'+(this.noEtape)).classList.remove('etatEtape');
            this.refFormulaire.querySelector('.step'+(this.noEtape+1)).classList.add('etatEtape');
            if(this.noEtape <= 1){
                this.btnPrecedent.classList.add('btn--cache');
            }
            if(this.noEtape < 4){
                this.btnSuivant.classList.remove('btn--cache');
                this.btnConfirmer.classList.add('btn--cache');
            }
        }

        console.log('fin' + this.noEtape);
    },

};







//Fin méthodes utilitaires**********************************

//*******************
// Écouteurs d'événements
//*******************
window.addEventListener('load', validation.initialiser.bind(validation));