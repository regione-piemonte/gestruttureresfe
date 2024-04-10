/*
 * Copyright Regione Piemonte - 2023
 * SPDX-License-Identifier: EUPL-1.2
 */

import VisureStruttureResidenziali from 'pages/VisureStruttureResidenziali'
import VisureStruttureResidenzialiSoggetti from 'pages/VisureStruttureResidenzialiSoggetti'
import PageNuovoOspitePersonale from 'pages/PageNuovoOspitePersonale'
import PageNuovoSoggetto from 'pages/PageNuovoSoggetto'
import PageVisuraDettaglio from 'pages/PageVisuraDettaglio'
import PageVisuraDettaglioSoggetti from 'pages/PageVisuraDettaglioSoggetti'
import PageElencoStrutture from 'pages/PageElencoStrutture'
import PageElencoStruttureBuono from 'pages/PageElencoStruttureBuono'
import PageElencoSoggetti from 'pages/PageElencoSoggetti'
import PageAccessoStruttura from 'pages/GestioneRsa/PageAccessoStruttura'
import PageGestioneRsa from 'pages/GestioneRsa/PageGestioneRsa'
import PageOspiteStruttura from 'pages/GestioneRsa/PageOspiteStruttura'
import GestioneRsaResidenze from 'pages/GestioneRsa/GestioneRsaResidenze'
import GestioneRsaAssStrutCat from 'pages/GestioneRsa/GestioneRsaAssStrutCat'
import GestioneRsaNote from 'pages/GestioneRsa/GestioneRsaNote'
import GestioneRsaManuale from 'pages/GestioneRsa/GestioneRsaManuale'
import PageDettaglioOspiteBuono from 'pages/GestioneRsa/PageDettaglioOspiteBuono'
import Index from 'pages/Index'
import PageNuovoOspiteBuono from 'pages/GestioneRsa/PageNuovoOspiteBuono'
import PageGestioneRsaMenu from "pages/GestioneRsa/PageGestioneRsaMenu";

export const ERROR_404 = {
  path: "*",
  name: "error404",
  component: () => import("pages/Error404.vue")
};


export const INDEX = {
  path: '',
  name: 'index',
  component: Index,

}


export const LISTA_STRUTTURE = {
  path: '/strutture',
  name: 'strutture',
  component: PageElencoStrutture,

}

export const LISTA_STRUTTURE_BUONO = {
  path: '/gestione_rsa/buono',
  name: 'buono',
  component: PageElencoStruttureBuono

}


export const LISTA_SOGGETTI = {
  path: '/soggetti',
  name: 'soggetti',
  component: PageElencoSoggetti
}

export const VISUALIZZA_PERSONALE_PAZIENTI = {
  path: '/visure/:id',
  name: 'visure',
  component: VisureStruttureResidenziali
}

export const VISUALIZZA_PERSONALE_SOGGETTI = {
  path: '/visure_soggetti/:id',
  name: 'visure_soggetti',
  component: VisureStruttureResidenzialiSoggetti
}

export const VISUALIZZA_PERSONALE_PAZIENTI_NO_BACK = {
  path: '/visure/struttura/:id',
  name: 'visure',
  component: VisureStruttureResidenziali
}

export const VISUALIZZA_PERSONALE_SOGGETTI_NO_BACK = {
  path: '/visure_soggetti/struttura/:id',
  name: 'visure_soggetti',
  component: VisureStruttureResidenzialiSoggetti
}

export const NUOVO_PERSONALE_OSPITE = {
  path: '/nuovo_soggetto/:id',
  name: 'nuovo_soggetto',
  component: PageNuovoOspitePersonale
}

export const NUOVO_OSPITE = {
  path: '/gestione_rsa/buono/nuovo_ospite/:id',
  name: 'nuovo_ospite',
  component: PageNuovoOspiteBuono
} 

export const NUOVO_SOGGETTO = {
  path: '/nuovo_soggetto_erogato/:id',
  name: 'nuovo_soggetto_erogato',
  component: PageNuovoSoggetto
}

export const DETTAGLIO_VISURA = {
  path: '/visure/dettaglio/:id/:idStrutturaRes',
  name: 'visura_dettaglio',
  component: PageVisuraDettaglio
}

export const DETTAGLIO_OSPITE = {
  path: '/gestione_rsa/buono/dettaglio/ospite',
  name: 'ospite_dettaglio',
  component: PageDettaglioOspiteBuono
}

export const DETTAGLIO_VISURA_SOGGETTI = {
  path: '/visure_soggetti/dettaglio/:id/:idStrutturaRes',
  name: 'visura_dettaglio_soggetti',
  component: PageVisuraDettaglioSoggetti
}

// export const INDEX = {
//   path: '/index',
//   name: 'index',
//   component: Index
// }

/* ****** GESTIONE RSA STRUTTURE ****** */


export const ACCESSO_ALLA_STRUTTURA = {
  path: '/gestione_rsa/buono/struttura/:id',
  name: 'struttura',
  component: PageAccessoStruttura
}

export const GESTIONE_RSA_RESIDENZE = {
  path: 'residenze',
  name: 'residenze',
  component: GestioneRsaResidenze
}

export const GESTIONE_RSA_ASS_STRUT_CAT = {
  path: 'ass_strut_cat',
  name: 'ass_strut_cat',
  component: GestioneRsaAssStrutCat
}

export const GESTIONE_RSA_NOTE = {
  path: 'note',
  name: 'note',
  component: GestioneRsaNote
}

export const GESTIONE_RSA_MANUALE = {
  path: 'manuale',
  name: 'manuale',
  component: GestioneRsaManuale
}

export const GESTIONE_RSA = {
  path: '/gestione_rsa',
  component: PageGestioneRsa,
  redirect: '/gestione_rsa/residenze',
  children: [
    GESTIONE_RSA_RESIDENZE,
    GESTIONE_RSA_ASS_STRUT_CAT,
    GESTIONE_RSA_NOTE,
    LISTA_STRUTTURE_BUONO,
    ACCESSO_ALLA_STRUTTURA,
    GESTIONE_RSA_MANUALE,
    NUOVO_OSPITE,
    DETTAGLIO_OSPITE
  ]
}

export const GESTIONE_RSA_MENU = {
  path: '/gestione_rsa_servizi',
  name: 'gestioneRsaMenu',
  component: PageGestioneRsaMenu,
  meta:{
    helpButtonDisabled: true
  }
}


export const LAYOUT_INDEX = {
  path: "/",
  component: () => import("layouts/MainLayout.vue"),
  children: [INDEX]
}

export const LAYOUT_PROVIDERS = {
  path: "/",
  component: () => import("layouts/ProvidersLayout.vue"),
  children: [
    LISTA_SOGGETTI,
    VISUALIZZA_PERSONALE_SOGGETTI,
    VISUALIZZA_PERSONALE_SOGGETTI_NO_BACK,
    NUOVO_SOGGETTO,
    DETTAGLIO_VISURA_SOGGETTI,
  ]
}
export const LAYOUT_RSA = {
  path: "/",
  component: () => import("layouts/RsaLayout.vue"),
  children: [
    LISTA_STRUTTURE,
  
    GESTIONE_RSA,
    GESTIONE_RSA_MENU,
    VISUALIZZA_PERSONALE_PAZIENTI,
    VISUALIZZA_PERSONALE_PAZIENTI_NO_BACK,
    NUOVO_PERSONALE_OSPITE,
    DETTAGLIO_VISURA,
  ]
}

const routes = [
    LAYOUT_INDEX,
    LAYOUT_PROVIDERS,
    LAYOUT_RSA,
    ERROR_404
]

export default routes;
