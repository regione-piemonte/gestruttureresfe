<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div>
    <!--    IN CASO DI ERRORE-->
    <template v-if="isError">
      <div class="row q-col-gutter-md q-my-md ">
        <div class="col-12 text-h6 q-mt-x text-center text-bold ">
          Si Ã¨ verificato un errore nel caricamento dei dati, si prega di
          ricaricare la pagina
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="richiestaFinalizzata">
        <div class="row q-col-gutter-md q-my-md">
          <div class="text-h6 col-12 text-center  text-bold">
            Richiesta Finalizzata
          </div>
          <div class="text-h6 col-12  text-bold">
            Dati del legale rappresentante
          </div>
          <q-input
            class="col-4  q-pt-md"
            label-color="black"
            label="Codice fiscale*"
            v-model="cf"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired, isValidCF]"
            @input="cfUpdate"
            :disable="true"
          />

          <q-input
            class="col-4  q-pb-md"
            label-color="black"
            label="Nome*"
            v-model="name"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-4  q-pb-md"
            label-color="black"
            label="Cognome*"
            v-model="lastName"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-4  q-py-md"
            label-color="black"
            label="Provincia di nascita*"
            v-model.number="birthProvince"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-4  q-py-md"
            label-color="black"
            label="Comune di nascita*"
            v-model.number="birthCity"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-4  q-py-sm"
            label-color="black"
            label="Data di nascita*"
            v-model="birthDate"
            stack-label
            type="date"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-4  q-py-md"
            label-color="black"
            label="Provincia di residenza*"
            v-model="residenceProvince"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-4  q-py-md"
            label-color="black"
            label="Comune di residenza*"
            v-model="residenceCity"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-4  q-py-md"
            label-color="black"
            label="Indirizzo di residenza*"
            v-model="residenceAddress"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-4  q-py-md"
            label-color="black"
            label="Provincia di domicilio"
            v-model="domicileProvince"
            dense
            outlined
            input-class="text-black text-bold"
            :disable="true"
          />

          <q-input
            class="col-4  q-py-md"
            label-color="black"
            label="Comune di domicilio"
            v-model="domicileCity"
            dense
            outlined
            input-class="text-black text-bold"
            :disable="true"
          />

          <q-input
            class="col-4  q-py-md"
            label-color="black"
            label="Indirizzo di domicilio"
            v-model="domicileAddress"
            dense
            outlined
            input-class="text-black text-bold"
            :disable="true"
          />

          <!--      TODO controllare la validitÃ  del cellulare come gestione pazienti-->
          <q-input
            class="col-6  q-pt-md"
            label-color="black"
            label="Telefono cellulare*"
            v-model="mobile"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired, ruleMobile]"
            :disable="true"
            prefix="+39"
            mask="###########"
          />

          <!--      TODO controllare la validitÃ  della mail come gestione pazienti-->
          <q-input
            class="col-6  q-pt-md"
            label-color="black"
            label="Mail*"
            v-model="email"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleMail, ruleRequired]"
            :disable="true"
          />

          <!--      <div class="col-12 text-h6 text-bold q-mt-md">In qualitÃ  di:</div>-->
          <!--      <div class="col-12 text-h6 ">Legale rappresentante dell'ente gestore</div>-->
          <template v-if="cfTit != null && cfTit != cf">
            <div class="text-h6 col-12  text-bold">
              Dati del Titolare effettivo
            </div>
            <q-input
              class="col-4  q-pt-md"
              label-color="black"
              label="Codice fiscale*"
              v-model="cfTit"
              dense
              outlined
              input-class="text-black text-bold"
              :rules="[ruleRequired]"
              :disable="true"
            />

            <q-input
              class="col-4  q-pb-md"
              label-color="black"
              label="Nome*"
              v-model="nameTit"
              dense
              outlined
              input-class="text-black text-bold"
              :rules="[ruleRequired]"
              :disable="true"
            />

            <q-input
              class="col-4  q-pb-md"
              label-color="black"
              label="Cognome*"
              v-model="lastNameTit"
              dense
              outlined
              input-class="text-black text-bold"
              :rules="[ruleRequired]"
              :disable="true"
            />

            <q-input
              class="col-4  q-py-md"
              label-color="black"
              label="Provincia di nascita*"
              v-model.number="birthProvinceTit"
              dense
              outlined
              input-class="text-black text-bold"
              :rules="[ruleRequired]"
              :disable="true"
            />

            <q-input
              class="col-4  q-py-md"
              label-color="black"
              label="Comune di nascita*"
              v-model="birthCityTit"
              dense
              outlined
              input-class="text-black text-bold"
              :rules="[ruleRequired]"
              :disable="true"
            />

            <q-input
              class="col-4  q-py-sm"
              label-color="black"
              label="Data di nascita*"
              v-model="birthDateTit"
              stack-label
              type="date"
              dense
              outlined
              input-class="text-black text-bold"
              :rules="[ruleRequired]"
              :disable="true"
            />
            <q-input
              class="col-4  q-py-md"
              label-color="black"
              label="Provincia di residenza"
              v-model.number="residenceProvinceTit"
              dense
              outlined
              input-class="text-black text-bold"
              :disable="true"
            />

            <q-input
              class="col-4  q-py-md"
              label-color="black"
              label="Comune di residenza"
              v-model="residenceCityTit"
              dense
              outlined
              input-class="text-black text-bold"
              :disable="true"
            />

            <q-input
              class="col-4  q-py-sm"
              label-color="black"
              label="Indirizzo di residenza"
              v-model="residenceAddressTit"
              stack-label
              dense
              outlined
              input-class="text-black text-bold"
              :disable="true"
            />
          </template>
          <div class="text-h6  text-bold">Dati della societÃ /ente gestore</div>

          <q-input
            class="col-12  q-pt-md"
            label-color="black"
            label="Cf / P.IVA*"
            v-model="enteCf"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            @input="enteCfUpdate"
            :disable="true"
          />

          <q-input
            class="col-12  q-pt-md"
            label-color="black"
            label="Denominazione*"
            v-model="enteName"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-4  q-pt-md"
            label-color="black"
            label="Provincia*"
            v-model="enteProvince"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-4  q-pt-md"
            label-color="black"
            label="Comune*"
            v-model="enteCity"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-4  q-pt-md"
            label-color="black"
            label="Indirizzo*"
            v-model="enteAddress"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <div class="text-h6 col-12  text-bold">
            Dati della struttura residenziale socio-assistenziale
          </div>

          <q-input
            class="col-6  q-pt-md"
            label-color="black"
            label="Denominazione*"
            v-model="structureName"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-6  q-pt-md"
            label-color="black"
            label="Tipologia*"
            v-model="structureType"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <q-input
            class="col-4  q-pt-md"
            label-color="black"
            label="Provincia*"
            v-model="structureProvince"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />
          <q-input
            class="col-4  q-pt-md"
            label-color="black"
            label="Comune*"
            v-model="structureCity"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />
          <q-input
            class="col-4  q-pt-md"
            label-color="black"
            label="Indirizzo*"
            v-model="structureAddress"
            dense
            outlined
            input-class="text-black text-bold"
            :rules="[ruleRequired]"
            :disable="true"
          />

          <div class="text-h6 col-12  text-bold">
            Tariffa massima mensile
          </div>

          <div
            class="row col-md-12"
            v-for="(fascia, i) in fasceFinale"
            :key="i"
          >
            <div class="col-md-6 q-py-lg">
              {{ fascia.welfareFasciaDesc }}
            </div>
            <div class="col-md-6 ">
              <q-input
                class="col-4  q-pt-md"
                label-color="black"
                label="Importo*"
                v-model.number="fascia.tariffaMensileMassima"
                step="50"
                min="0"
                dense
                outlined
                input-class="text-black text-bold"
                :rules="[ruleRequired]"
                type="number"
                @input="setTwoNumberDecimal(i)"
                :disable="true"
              >
              </q-input>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="firstPhaseDone">
          <div
            v-if="!rilevazioniPresenti"
            class="col-12 text-h6 q-mt-x text-center text-bold bg-red q-pa-lg text-white"
          >
            <q-icon name="error" />Non Ã¨ possibile continuare con la richiesta
            di adesione poiche' non sono presenti 6 rilevazioni nelle ultime 8
            settimane!
          </div>
          <div class="text-h6 col-12  text-bold">
            Documentazione da allegare
          </div>
          <!-- TO DO Mettere pulsante scarica -->
          <div class="row justify-end ">
            <div class=" q-py-lg q-px-md text-bold text-h6 text-right">
              <q-btn :loading="isSaving" @click="apriLink" color="primary">
                SCARICA ATTESTATO DI NOMINA
              </q-btn>
            </div>
            <div class=" q-py-lg q-px-md text-bold text-h6 text-right">
              <q-btn
                :loading="isSaving"
                @click="downloadModulo"
                color="primary"
              >
                SCARICA MODULO DI PARTECIPAZIONE
              </q-btn>
            </div>
          </div>
          <div class="row">
            <q-form class="q-px-md col-md-12" ref="formAllegato">
              <div class="row col-md-12" v-for="(file, i) in files" :key="i">
                <q-file
                  class="col-12"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  v-model="file.value"
                  :label="file.fileTipoDesc"
                  label-color="black"
                  clearable
                  :rules="[ruleRequired, ruleFileNotEmpty]"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
              <!-- <q-file class="col-12" dense outlined input-class="text-black text-bold" v-model="secondFile"
                label="Documento di identitÃ  del legale rappresentante" label-color="black" clearable
                :rules="[ruleRequired]">
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file> -->

              <div class="col-12 q-py-lg text-bold text-h6 text-right">
                <q-btn
                  :loading="isSaving"
                  @click="openSecondConfirmModal"
                  color="primary"
                >
                  Finalizza Richiesta
                </q-btn>
              </div>
            </q-form>
          </div>
          <!-- TO DO Mettere pulsante di finalizzazione con apertura model -->
        </template>
        <template v-else>
          <template v-if="!checkdCfIva">
            <q-form class="q-px-md" ref="formInitial">
              <div class="row q-col-gutter-md q-my-md justify-end">
                <div
                  v-if="!rilevazioniPresenti"
                  class="col-12 text-h6 q-mt-x text-center text-bold bg-red q-pa-lg text-white"
                >
                  <q-icon name="error" /> Non Ã¨ possibile continuare con la
                  richiesta di adesione poiche' non sono presenti 6 rilevazioni
                  nelle ultime 8 settimane!
                </div>
                <div class="col-12 text-h6 q-mt-x text-center text-bold">
                  Inserisci i dati identificativi della societÃ /ente che
                  gestisce la struttura per procedere al form
                </div>

                <div class="col-3">
                  <q-input
                    class=" "
                    label-color="black"
                    label="CF / P.IVA della societa'/ente*"
                    v-model="enteCf"
                    dense
                    outlined
                    input-class="text-black text-bold"
                    :rules="[ruleRequired]"
                    @input="enteCfUpdate"
                    mask="XXXXXXXXXXXXXXXX"
                    :disable="!rilevazioniPresenti"
                  />
                </div>

                <div class="col-3">
                  <q-input
                    class=" "
                    label-color="black"
                    label="Cf del legale rappresentante*"
                    v-model="cf"
                    dense
                    outlined
                    input-class="text-black text-bold"
                    :rules="[ruleRequired, isValidCF]"
                    @input="cfUpdate"
                    mask="XXXXXXXXXXXXXXXX"
                    :disable="!rilevazioniPresenti"
                  >
                    <q-tooltip max-width="300px"
                      ><div class="text-body2">
                        ATTENZIONE: nel caso in cui il rappresentante legale non
                        sia anche titolare effettivo, indicare anche il CF del
                        titolare effettivo qui di fianco.
                      </div></q-tooltip
                    >
                  </q-input>
                </div>
                <div class="col-3">
                  <q-input
                    class=" "
                    label-color="black"
                    label="Cf del titolare effettivo (Opzionale)"
                    v-model="cfTitolare"
                    dense
                    outlined
                    input-class="text-black text-bold"
                    mask="XXXXXXXXXXXXXXXX"
                    :disable="!rilevazioniPresenti"
                  >
                    <q-tooltip max-width="300px">
                      <div class="text-body2">
                        Secondo il D.Lgs. n. 90 del 25 maggio 2017, emanato in
                        attuazione della Direttiva UE 2015/849 e parte della
                        normativa antiriciclaggio, il Titolare Effettivo Ã¨ la
                        persona fisica che realizza unâoperazione o unâattivitÃ 
                        oppure, nel caso di entitÃ  giuridica, chi come persona
                        fisica, in ultima istanza, la possiede o controlla o ne
                        Ã¨ beneficiaria. <br />
                        ATTENZIONE: da indicare solo nel caso in cui non
                        coincida con il rappresentante legale
                      </div>
                    </q-tooltip>
                  </q-input>
                </div>
                <div class="col-3 text-center">
                  <q-btn
                    :loading="isLoadingCfIva"
                    @click="onCheckCfIva"
                    color="primary"
                    class="q-px-lg"
                    :disable="!rilevazioniPresenti"
                    >Conferma</q-btn
                  >
                </div>
                <template v-if="!firstFileNotRequired">
                  <div class="row col-md-12">
                    <div class="col-md-9 q-py-lg">
                      <q-file
                        class="col-12"
                        dense
                        outlined
                        input-class="text-black text-bold"
                        v-model="firstFile.value"
                        :label="firstFile.fileTipoDesc"
                        label-color="black"
                        clearable
                        accept=".pdf"
                        :rules="[ruleFirstFile]"
                      >
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-file>
                    </div>
                    <div
                      class="col-md-3 q-py-lg q-px-md text-bold text-h6 text-right "
                    >
                      <q-btn
                        :loading="isSaving"
                        @click="showDelega"
                        color="primary"
                      >
                        SCARICA MODULO DI DELEGA
                      </q-btn>
                    </div>
                  </div>
                </template>
              </div>
            </q-form>
          </template>
          <template v-else>
            <q-form class="q-px-md" ref="formComplete">
              <div class="row q-col-gutter-md q-my-md">
                <div
                  v-if="!rilevazioniPresenti"
                  class="col-12 text-h6 q-mt-x text-center text-bold bg-red q-pa-lg text-white"
                >
                  <q-icon name="error" />Non Ã¨ possibile continuare con la
                  richiesta di adesione poiche' non sono presenti 6 rilevazioni
                  nelle ultime 8 settimane!
                </div>

                <div class="text-h6 col-12  text-bold">
                  Dati del legale rappresentante
                </div>
                <q-input
                  class="col-4  q-pt-md"
                  label-color="black"
                  label="Codice fiscale*"
                  v-model="cf"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired, isValidCF]"
                  @input="cfUpdate"
                  :disable="true"
                  mask="XXXXXXXXXXXXXXXX"
                />

                <q-input
                  class="col-4  q-pb-md"
                  label-color="black"
                  label="Nome*"
                  v-model="name"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-pb-md"
                  label-color="black"
                  label="Cognome*"
                  v-model="lastName"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-py-md"
                  label-color="black"
                  label="Provincia di nascita*"
                  v-model.number="birthProvince"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-py-md"
                  label-color="black"
                  label="Comune di nascita*"
                  v-model="birthCity"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-py-sm"
                  label-color="black"
                  label="Data di nascita*"
                  v-model="birthDate"
                  stack-label
                  type="date"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-py-md"
                  label-color="black"
                  label="Provincia di residenza*"
                  v-model="residenceProvince"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-py-md"
                  label-color="black"
                  label="Comune di residenza*"
                  v-model="residenceCity"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-py-md"
                  label-color="black"
                  label="Indirizzo di residenza*"
                  v-model="residenceAddress"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-py-md"
                  label-color="black"
                  label="Provincia di domicilio"
                  v-model="domicileProvince"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-py-md"
                  label-color="black"
                  label="Comune di domicilio"
                  v-model="domicileCity"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-py-md"
                  label-color="black"
                  label="Indirizzo di domicilio"
                  v-model="domicileAddress"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :disable="!rilevazioniPresenti"
                />

                <!--      TODO controllare la validitÃ  del cellulare come gestione pazienti-->

                <q-input
                  class="col-6  q-pt-md"
                  label-color="black"
                  label="Telefono cellulare*"
                  v-model="mobile"
                  dense
                  mask="###########"
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired, ruleMobile]"
                  :disable="!rilevazioniPresenti"
                  prefix="+39"
                />

                <q-input
                  class="col-6  q-pt-md"
                  label-color="black"
                  label="Mail*"
                  v-model="email"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleMail, ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <!--      <div class="col-12 text-h6 text-bold q-mt-md">In qualitÃ  di:</div>-->
                <!--      <div class="col-12 text-h6 ">Legale rappresentante dell'ente gestore</div>-->
                <template v-if="cfTit != null && cfTit != cf">
                  <div class="text-h6 col-12  text-bold">
                    Dati del Titolare effettivo
                  </div>
                  <q-input
                    class="col-4  q-pt-md"
                    label-color="black"
                    label="Codice fiscale*"
                    v-model="cfTit"
                    dense
                    outlined
                    input-class="text-black text-bold"
                    :rules="[ruleRequired]"
                    :disable="true"
                    mask="XXXXXXXXXXXXXXXX"
                  />

                  <q-input
                    class="col-4  q-pb-md"
                    label-color="black"
                    label="Nome*"
                    v-model="nameTit"
                    dense
                    outlined
                    input-class="text-black text-bold"
                    :rules="[ruleRequired]"
                    :disable="true"
                  />

                  <q-input
                    class="col-4  q-pb-md"
                    label-color="black"
                    label="Cognome*"
                    v-model="lastNameTit"
                    dense
                    outlined
                    input-class="text-black text-bold"
                    :rules="[ruleRequired]"
                    :disable="true"
                  />

                  <q-input
                    class="col-4  q-py-md"
                    label-color="black"
                    label="Provincia di nascita*"
                    v-model.number="birthProvinceTit"
                    dense
                    outlined
                    input-class="text-black text-bold"
                    :rules="[ruleRequired]"
                    :disable="true"
                  />

                  <q-input
                    class="col-4  q-py-md"
                    label-color="black"
                    label="Comune di nascita*"
                    v-model="birthCityTit"
                    dense
                    outlined
                    input-class="text-black text-bold"
                    :rules="[ruleRequired]"
                    :disable="true"
                  />

                  <q-input
                    class="col-4  q-py-sm"
                    label-color="black"
                    label="Data di nascita*"
                    v-model="birthDateTit"
                    stack-label
                    type="date"
                    dense
                    outlined
                    input-class="text-black text-bold"
                    :rules="[ruleRequired]"
                    :disable="true"
                  />

                  <q-input
                    class="col-4  q-py-md"
                    label-color="black"
                    label="Provincia di residenza"
                    v-model.number="residenceProvinceTit"
                    dense
                    outlined
                    input-class="text-black text-bold"
                    :disable="!rilevazioniPresenti"
                  />

                  <q-input
                    class="col-4  q-py-md"
                    label-color="black"
                    label="Comune di residenza"
                    v-model="residenceCityTit"
                    dense
                    outlined
                    input-class="text-black text-bold"
                    :disable="!rilevazioniPresenti"
                  />

                  <q-input
                    class="col-4  q-py-sm"
                    label-color="black"
                    label="Indirizzo di residenza"
                    v-model="residenceAddressTit"
                    stack-label
                    dense
                    outlined
                    input-class="text-black text-bold"
                    :disable="!rilevazioniPresenti"
                  />
                </template>

                <div class="text-h6  text-bold">
                  Dati della societÃ /ente gestore
                </div>

                <q-input
                  class="col-12  q-pt-md"
                  label-color="black"
                  label="Cf / P.IVA*"
                  v-model="enteCf"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  @input="enteCfUpdate"
                  :disable="true"
                  mask="XXXXXXXXXXXXXXXX"
                />

                <q-input
                  class="col-12  q-pt-md"
                  label-color="black"
                  label="Denominazione*"
                  v-model="enteName"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-pt-md"
                  label-color="black"
                  label="Provincia*"
                  v-model="enteProvince"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-pt-md"
                  label-color="black"
                  label="Comune*"
                  v-model="enteCity"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-pt-md"
                  label-color="black"
                  label="Indirizzo*"
                  v-model="enteAddress"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <div class="text-h6 col-12  text-bold">
                  Dati della struttura residenziale socio-assistenziale
                </div>

                <q-input
                  class="col-6  q-pt-md"
                  label-color="black"
                  label="Denominazione*"
                  v-model="structureName"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-6  q-pt-md"
                  label-color="black"
                  label="Tipologia*"
                  v-model="structureType"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <q-input
                  class="col-4  q-pt-md"
                  label-color="black"
                  label="Provincia*"
                  v-model="structureProvince"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />
                <q-input
                  class="col-4  q-pt-md"
                  label-color="black"
                  label="Comune*"
                  v-model="structureCity"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />
                <q-input
                  class="col-4  q-pt-md"
                  label-color="black"
                  label="Indirizzo*"
                  v-model="structureAddress"
                  dense
                  outlined
                  input-class="text-black text-bold"
                  :rules="[ruleRequired]"
                  :disable="!rilevazioniPresenti"
                />

                <div class="text-h6 col-12  text-bold">
                  Tariffa massima mensile
                </div>

                <div
                  class="row col-md-12"
                  v-for="(fascia, i) in fasce"
                  :key="i"
                >
                  <div class="col-md-6 q-py-lg">
                    {{ fascia.welfareFasciaDesc }}
                  </div>
                  <div class="col-md-6 ">
                    <q-input
                      class="col-4  q-pt-md"
                      label-color="black"
                      label="Importo*"
                      v-model.number="fascia.value"
                      step="50"
                      min="0"
                      dense
                      outlined
                      input-class="text-black text-bold"
                      :rules="[ruleRequired]"
                      type="number"
                      :disable="!rilevazioniPresenti"
                      @input="setTwoNumberDecimal(i)"
                    >
                      <q-tooltip max-width="300px">
                        <div class="text-body2">
                          Indicare il valore massimo della tariffa mensile
                          applicata in favore di nuovi utenti destinatari del
                          âBuonoâ, comprensiva del valore del voucher regionale
                          (â¬ 600,00), differenziata per fasce di intensitÃ 
                          assistenziale (entro i limiti previsti dalla D.G.R. n.
                          45-4248 del 30 luglio 2012 e dalla D.G.R. 7 Settembre
                          2022, n. 1-5575)
                        </div>
                      </q-tooltip>
                    </q-input>
                  </div>
                </div>
                <!-- <q-table class="mmg-subject-list-table q-table-striped col-md-12" :data="fasce"
                   :columns="columns"
                  color="primary">

                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="fascia" :props="props">
                        {{ props.row.welfareFasciaDesc }}
                      </q-td>
                      <q-td key="importo" :props="props">
                        <q-input class="col-4  q-pt-md" label-color="black" label="Importo*" v-model.number="props.row.importo" step="50" min="0"
                          dense outlined input-class="text-black text-bold" :rules="[ruleRequired]" type="number" pattern="^\d*(\.\d{0,2})?$"
                          :disable="!rilevazioniPresenti" @input=""/>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table> -->

                <!-- <q-select class="col-6  q-pt-md" label="Fascia*" v-model="welfareFasciaId" :options="fasce"
                  :rules="[val => welfareFasciaId != null || 'Inserire la fascia']" option-value="welfareFasciaId"
                  option-label="welfareFasciaDesc" filled clearable map-options emit-value dense :loading="isLoading"
                  :disable="!rilevazioniPresenti" /> -->
                <!--      TODO questo tasto dovrÃ  salvare i dati inseriti (tranne i file), nascondere il form e visualizzare solo i tasti per l'inserimento dei file e lo scarico del pdf. Il pdf scaricato dovrÃ  essere caricato come 4*file aggiuntivo-->
                <!--      TODO l'api che ora salva i dati non dovrÃ  piÃ¹ passare i file che saranno gestiti con api a parte-->
                <!--      TODO dopo aver caricato anche i file si dovrÃ  presentare un popup di conferma e poi salvare per finire il processo-->
                <!--      TODO se tutti i dati sono inseriti non si deve poter modificare nulla, e in visualizzazione avrÃ² "ciÃ² che ho inserito" tramite api GET nuova-->
                <div class="col-12 text-bold text-h6 text-center ">
                  <q-btn
                    :loading="isSaving"
                    @click="openConfirmModal"
                    color="primary"
                    :disable="!rilevazioniPresenti"
                  >
                    Presenta domanda di partecipazione alla misura âBUONO
                    RESIDENZIALITAââ
                  </q-btn>
                </div>
              </div>
            </q-form>
          </template>
        </template>
      </template>
      <q-dialog full-width v-model="isModalOpen">
        <q-card style="max-width: 800px !important;">
          <q-card-section class="q-py-none">
            <q-toolbar class="q-px-none">
              <q-toolbar-title>
                Conferma
              </q-toolbar-title>

              <q-btn
                v-close-popup
                flat
                round
                dense
                icon="close"
                :disable="isLoading"
              />
            </q-toolbar>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-h6 q-mt-x text-bold">
              I dati conferiti con la compilazione del form produrranno un pdf
              che dovrÃ  essere firmato dal legale rappresentante indicato e che
              dovrÃ  essere ricaricato sulla piattaforma negli step successivi
              del processo di partecipazione al buono residenzialitÃ .
              <br />
              Confermando l'operazione non sarÃ  piÃ¹ possibile modificare i dati
              della richiesta. Sei sicuro?
            </div>
            <div class="row">
              <div class="col-12"></div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row reverse q-col-gutter-md">
              <div class="col-md-auto col-12">
                <q-btn
                  class="full-width"
                  color="primary"
                  @click="onSave"
                  :loading="isLoading"
                >
                  Conferma
                </q-btn>
              </div>
              <div class="col-md-auto col-12">
                <q-btn
                  class="full-width"
                  color="primary"
                  outline
                  v-close-popup
                  :disable="isLoading"
                >
                  Indietro
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog full-width v-model="isSecondModalOpen">
        <q-card style="max-width: 800px !important;">
          <q-card-section class="q-py-none">
            <q-toolbar class="q-px-none">
              <q-toolbar-title>
                Finalizza richiesta
              </q-toolbar-title>

              <q-btn
                v-close-popup
                flat
                round
                dense
                icon="close"
                :disable="isLoading"
              />
            </q-toolbar>
          </q-card-section>

          <q-separator />
          <q-card-section>
            <div class="text-h6 q-mt-x text-left text-bold">
              <!-- DICHIARO DI:
                <br>
                <q-toggle v-model="firstBoolean"/> aver preso visione dell'<a
                  class="text-blue cursor-pointer" @click="apriLink">ATTO DI NOMINA A RESP.
                  ESTERNO</a>
                <br>
                <q-toggle v-model="secondBoolean"/> accettare la nomina a responsabile
                esterno
                del trattamento dei dati personali conferiti alla Regione Piemonte da parte dei richiedenti il âBuonoâ e
                riferiti agli utenti della struttura. -->
              Sei sicuro di finalizzare la richiesta?
            </div>
            <div class="row">
              <div class="col-12"></div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row reverse q-col-gutter-md">
              <div class="col-md-auto col-12">
                <q-btn
                  class="full-width"
                  color="primary"
                  @click="salvaAllegati"
                  :loading="isLoading"
                >
                  Conferma
                </q-btn>
              </div>
              <div class="col-md-auto col-12">
                <q-btn
                  class="full-width"
                  color="primary"
                  outline
                  v-close-popup
                  :disable="isLoading"
                >
                  Indietro
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog full-width v-model="isModalSicuro">
        <q-card style="max-width: 800px !important;">
          <q-card-section class="q-py-none">
            <q-toolbar class="q-px-none">
              <q-toolbar-title>
                Conferma
              </q-toolbar-title>

              <q-btn
                v-close-popup
                flat
                round
                dense
                icon="close"
                :disable="isLoading"
              />
            </q-toolbar>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-h6 q-mt-x text-left text-bold">
              {{ testo }}
            </div>
            <div class="row">
              <div class="col-12"></div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row reverse q-col-gutter-md">
              <div class="col-md-auto col-12">
                <q-btn
                  class="full-width"
                  color="primary"
                  @click="confermaSicuro"
                  :loading="isLoading"
                >
                  Conferma
                </q-btn>
              </div>
              <div class="col-md-auto col-12">
                <q-btn
                  class="full-width"
                  color="primary"
                  outline
                  v-close-popup
                  :disable="isLoading"
                >
                  Indietro
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>
  </div>
</template>

<script>
import {
  file2Base64,
  isValidCF,
  notifyError,
  notifySuccess
} from "../../services/utils";
import { TYPES } from "../../store";
import {
  createWelfareRequest,
  createWelfareRequestForAllegato,
  downloadModulo,
  getListFile,
  getWelfareFasce,
  getWelfareRequest,
  verificaFirma,
  verificaStruttura
} from "../../services/api";
import WelfareConfirmDialog from "./WelfareConfirmDialog";
import { DELEGA, EMAIL_REGEX, ONLY_NUMBER } from "src/services/business_logic";
import { date, openURL } from "quasar";
const { formatDate } = date;
export default {
  name: "FormWelfare",
  components: { WelfareConfirmDialog },
  props: {
    idStruttura: { type: String },
    stiNome: { type: String },
    comune: { type: String },
    stiIndirizzo: { type: String },
    tipoStrutturaDesc: { type: String },
    siglaProv: { type: String },
    stiId: { type: Number },
    stiTelefono: { type: String },
    stiEmail: { type: String },
    stiEmail2: { type: String },
    stiPec: { type: String },
    stiAsmedMmg: { type: Boolean },
    assmedId: { type: Number },
    stiAsmedMista: { type: Boolean },
    stiPersInfNotturno: { type: Boolean },
    stiMensaInternaPresente: { type: Boolean },
    stiAdesioneDgr10: { type: Boolean },
    stiDirStrPresente: { type: Boolean },
    stiDirStrNome: { type: String },
    stiDirStrEmail: { type: String },
    stiDirStrTelReperibilita: { type: String },
    stiDirSanitPresente: { type: Boolean },
    stiDirSanitNome: { type: String },
    stiDirSanitEmail: { type: String },
    stiDirSanitTelReperibilita: { type: String },
    stiCoordInfPresente: { type: Boolean },
    stiCoordInfNome: { type: String },
    stiCoordInfEmail: { type: String },
    stiCoordInfTelReperibilita: { type: String }
  },
  data() {
    return {
      isError: false,
      firstPhaseDone: false,
      isModalOpen: false,
      isSecondModalOpen: false,
      isSaving: false,
      isLoadingCfIva: false,
      checkdCfIva: false,
      firstFile: null,
      secondFile: null,
      thirdFile: null,
      name: null,
      lastName: null,
      birthCity: null,
      birthDate: null,
      residenceCity: null,
      residenceAddress: null,
      domicileCity: null,
      domicileAddress: null,
      cf: null,
      mobile: null,
      email: null,
      enteName: null,
      enteAddress: null,
      enteCf: null,
      structureName: null,
      structureType: null,
      structureAddress: null,
      provinceCity: null,
      domicileProvince: null,
      birthProvince: null,
      enteProvince: null,
      enteCity: null,
      structureProvince: null,
      structureCity: null,
      residenceProvince: null,
      rilevazioniPresenti: true,
      richiestaFinalizzata: false,
      isLoading: false,
      response: {},
      responseVerifica: {},
      fasce: [],
      welfareFasciaId: null,
      rapLegVerificato: false,
      entGestVerificato: false,
      rapLegInvariato: true,
      entGestInvariato: true,
      strResInvariato: true,
      titEffInvariato: true,
      fourFile: null,
      isModalSicuro: false,
      testo: "",
      cfTitolare: null,
      columns: [
        {
          name: "fascia",
          label: "Fascia",
          align: "left",
          headerClasses: "mmg-subject-list-table__header__event",
          classes: "mmg-subject-list-table__body__event text-space-normal"
          // field: row => row.codFiscale
        },
        {
          name: "importo",
          label: "Importo",
          align: "left",
          headerClasses: "mmg-subject-list-table__header__subject",
          classes: "mmg-subject-list-table__body__subject"
          // field: row => row.cognome
        }
      ],
      cfTit: null,
      lastNameTit: null,
      nameTit: null,
      birthCityTit: null,
      birthDateTit: null,
      birthProvinceTit: null,
      residenceCityTit: null,
      residenceProvinceTit: null,
      residenceAddressTit: null,
      importo: [],
      files: [],
      titEffVerificato: false,
      firstBoolean: false,
      secondBoolean: false
    };
  },
  async created() {
    try {
      this.isLoading = true;
      this.getDati();
      let data = await getWelfareFasce();

      this.fasce = data.data;
      let f = await getListFile();
      this.files = f.data.filter(file => file.fileTipoGruppo == "FIN");
      let params = {
        fileTipoCod: DELEGA
      };
      let first = await getListFile(params);
      this.firstFile = first.data[0];

      // for(let fascia of this.fasce){
      //   fascia.importo = parseFloat(0).toFixed(2);
      // }
      this.isLoading = false;
    } catch (e) {
      let r = {
        descrizione:
          "Si Ã¨ verificato un errore interno, se il problema persiste contattare l'assistenza"
      };
      if (e.response) {
        r = e.response.data;
      }

      let message = r.descrizione;
      notifyError(e, message);
    }
  },
  computed: {
    user() {
      return this.$store.getters[TYPES.GETTERS.USER];
    },
    firstFileNotRequired() {
      if (this.cf != null && this.cf != "") {
        if (this.user.cfUtente !== this.cf) {
          return false;
        }
        return true;
      } else {
        return true;
      }
    },
    ruleFirstFile() {
      return v =>
        this.firstFileNotRequired ||
        (v !== null && v !== undefined && v !== "") ||
        "Campo obbligatorio";
    },
    ruleMail() {
      return v => !v || EMAIL_REGEX.test(v) || "Deve essere un'email";
    },
    ruleMobile() {
      return v =>
        !v || ONLY_NUMBER.test(v) || "Deve essere un numero di cellulare";
    },
    isValidCF() {
      return v => {
        if (!v) return true;
        return isValidCF(v) || "Inserire un codice fiscale valido";
      };
    },
    ruleRequired() {
      return v =>
        (v !== null && v !== undefined && v !== "") || "Campo obbligatorio";
    },
    ruleFileNotEmpty() {
        return v => (!!v && v.size >0 ) || "File vuoto"
    }
  },
  watch: {},
  methods: {
    enteCfUpdate(val) {
      let value = val?.toUpperCase()?.trim() ?? "";
      this.enteCf = value;
      //this.$emit("update:enteCf", value);
    },
    cfUpdate(val) {
      let value = val?.toUpperCase()?.trim() ?? "";
      this.cf = value;
      // this.$emit("update:cf", value);
    },

    async onCheckCfIva() {
      try {
        let isValid = await this.$refs.formInitial.validate();
        if (!isValid) return;
        this.isLoadingCfIva = true;
        let param = {
          cfRappLeg: this.cf,
          cfTitolare: this.cfTitolare === "" ? null : this.cfTitolare
        };
        if (!this.firstFileNotRequired) {
          let payload = {
            filename: this.firstFile.value.name,
            base64String: await file2Base64(this.firstFile.value)
          };
          let verifica = await verificaFirma(payload, param);
        }

        let data = await verificaStruttura(this.enteCf, param);
        this.responseVerifica = data.data;
        if (this.responseVerifica.rappresentanteLegale) {
          this.cf = this.responseVerifica.rappresentanteLegale.codiceFiscale;
          this.lastName = this.responseVerifica.rappresentanteLegale.cognome;
          this.name = this.responseVerifica.rappresentanteLegale.nome;
          this.birthCity = this.responseVerifica.rappresentanteLegale.comuneNascita;
          let d = this.responseVerifica.rappresentanteLegale.dataNascita.split(
            "/"
          );
          let dataNascita = d[2] + "-" + d[1] + "-" + d[0];
          this.birthDate = formatDate(dataNascita, "YYYY-MM-DD");

          this.birthProvince = this.responseVerifica.rappresentanteLegale.provinciaNascita;
          this.residenceCity = this.responseVerifica.rappresentanteLegale.comuneResidenza;
          this.residenceProvince = this.responseVerifica.rappresentanteLegale.provinciaResidenza;
          this.residenceAddress = this.responseVerifica.rappresentanteLegale.indirizzoResidenza;
        }
        this.enteName = this.responseVerifica.ragioneSociale;
        if (this.responseVerifica.sede) {
          this.enteCity = this.responseVerifica.sede.descrComune;
          this.enteAddress = this.responseVerifica.sede.indirizzo;
          this.enteProvince = this.responseVerifica.sede.siglaProvincia;
        }
        this.structureName = this.stiNome;
        this.structureType = this.tipoStrutturaDesc;
        this.structureCity = this.comune;
        this.structureAddress = this.stiIndirizzo;
        this.structureProvince = this.siglaProv;
        this.rapLegVerificato = this.responseVerifica.rapLegVerificato;
        this.entGestVerificato = this.responseVerifica.entGestVerificato;
        this.titEffVerificato = this.responseVerifica.titEffVerificato;
        if (this.responseVerifica.titolare) {
          this.cfTit = this.responseVerifica.titolare.codiceFiscale;
          this.lastNameTit = this.responseVerifica.titolare.cognome;
          this.nameTit = this.responseVerifica.titolare.nome;
          this.birthCityTit = this.responseVerifica.titolare.comuneNascita;
          let dTit = this.responseVerifica.titolare.dataNascita.split("/");
          let dataNascitaTit = dTit[2] + "-" + dTit[1] + "-" + dTit[0];
          this.birthDateTit = formatDate(dataNascitaTit, "YYYY-MM-DD");
          this.birthProvinceTit = this.responseVerifica.titolare.provinciaNascita;
          this.residenceCityTit = this.responseVerifica.titolare.comuneResidenza;
          this.residenceProvinceTit = this.responseVerifica.titolare.provinciaResidenza;
          this.residenceAddressTit = this.responseVerifica.titolare.indirizzoResidenza;
        }

        if (!this.entGestVerificato) {
          this.isModalSicuro = true;
          this.testo =
            "Ente gestore non trovato in anagrafica. Sei sicuro di voler proseguire?";
        } else if (!this.rapLegVerificato) {
          this.isModalSicuro = true;
          this.testo =
            "Il CF non corrisponde al legale rappresentante presente in anagrafica. Sei sicuro di voler proseguire?";
        } else {
          this.checkdCfIva = true;
        }

        this.isLoadingCfIva = false;
      } catch (e) {
        let r = {
          descrizione:
            "Si Ã¨ verificato un errore interno, se il problema persiste contattare l'assistenza"
        };
        if (e.response) {
          r = e.response.data;
        }
        let message = r.descrizione;
        notifyError(e, message);
        this.isLoadingCfIva = false;
      }
    },
    async openConfirmModal() {
      let isValid = await this.$refs.formComplete.validate();
      if (isValid) this.isModalOpen = true;
    },
    async openSecondConfirmModal() {
      let isValid = await this.$refs.formAllegato.validate();
      if (isValid) this.isSecondModalOpen = true;
    },
    async onSave() {
      this.isLoading = true;
      if (this.cf != this.responseVerifica.rappresentanteLegale.codiceFiscale) {
        this.rapLegInvariato = false;
      }
      if (this.lastName != this.responseVerifica.rappresentanteLegale.cognome) {
        this.rapLegInvariato = false;
      }
      if (this.name != this.responseVerifica.rappresentanteLegale.nome) {
        this.rapLegInvariato = false;
      }
      if (
        this.birthCity !=
        this.responseVerifica.rappresentanteLegale.comuneNascita
      ) {
        this.rapLegInvariato = false;
      }
      let d = this.responseVerifica.rappresentanteLegale.dataNascita.split("/");
      let dataNascita = d[2] + "-" + d[1] + "-" + d[0];
      if (this.birthDate != formatDate(dataNascita, "YYYY-MM-DD")) {
        this.rapLegInvariato = false;
      }
      if (
        this.birthProvince !=
        this.responseVerifica.rappresentanteLegale.provinciaNascita
      ) {
        this.rapLegInvariato = false;
      }
      if (
        this.residenceCity !=
        this.responseVerifica.rappresentanteLegale.comuneResidenza
      ) {
        this.rapLegInvariato = false;
      }
      if (
        this.residenceProvince !=
        this.responseVerifica.rappresentanteLegale.provinciaResidenza
      ) {
        this.rapLegInvariato = false;
      }
      if (
        this.residenceAddress !=
        this.responseVerifica.rappresentanteLegale.indirizzoResidenza
      ) {
        this.rapLegInvariato = false;
      }
      if (this.enteName != this.responseVerifica.ragioneSociale) {
        this.entGestInvariato = false;
      }
      if (this.responseVerifica.sede) {
        if (this.enteCity != this.responseVerifica.sede.descrComune) {
          this.entGestInvariato = false;
        }
        if (this.enteAddress != this.responseVerifica.sede.indirizzo) {
          this.entGestInvariato = false;
        }
        if (this.enteProvince != this.responseVerifica.sede.siglaProvincia) {
          this.entGestInvariato = false;
        }
      } else {
        this.entGestInvariato = false;
      }
      if (this.structureName != this.stiNome) {
        this.strResInvariato = false;
      }
      if (this.structureType != this.tipoStrutturaDesc) {
        this.strResInvariato = false;
      }
      if (this.structureCity != this.comune) {
        this.strResInvariato = false;
      }
      if (this.structureAddress != this.stiIndirizzo) {
        this.strResInvariato = false;
      }
      if (this.structureProvince != this.siglaProv) {
        this.strResInvariato = false;
      }
      if (this.responseVerifica.titolare) {
        if (
          this.residenceCityTit !=
          this.responseVerifica.titolare.comuneResidenza
        ) {
          this.titEffInvariato = false;
        }
        if (
          this.residenceProvinceTit !=
          this.responseVerifica.titolare.provinciaResidenza
        ) {
          this.titEffInvariato = false;
        }
        if (
          this.residenceAddressTit !=
          this.responseVerifica.titolare.indirizzoResidenza
        ) {
          this.titEffInvariato = false;
        }
      }
      let payload = {
        rapLegCodiceFiscale: this.cf,
        rapLegCognome: this.lastName,
        rapLegNome: this.name,
        rapLegComuneNascita: this.birthCity,
        rapLegProvinciaNascita: this.birthProvince,
        rapLegDataNascita: this.birthDate,
        rapLegComuneResidenza: this.residenceCity,
        rapLegProvinciaResidenza: this.residenceProvince,
        rapLegIndirizzoResidenza: this.residenceAddress,
        rapLegComuneDomicilio: this.domicileCity,
        rapLegProvinciaDomicilio: this.domicileProvince,
        rapLegIndirizzoDomicilio: this.domicileAddress,
        rapLegCellulare: "+39" + this.mobile,
        rapLegEmail: this.email,
        entGestRagioneSociale: this.enteName,
        entGestComune: this.enteCity,
        entGestIndirizzo: this.enteAddress,
        entGestProvincia: this.enteProvince,
        strResNome: this.structureName,
        strResTipologia: this.structureType,
        strResComune: this.structureCity,
        strResIndirizzo: this.structureAddress,
        strResProvincia: this.structureProvince,
        titEffCodiceFiscale: this.cfTit,
        titEffCognome: this.lastNameTit,
        titEffNome: this.nameTit,
        titEffComuneNascita: this.birthCityTit,
        titEffDataNascita: this.birthDateTit,
        titEffProvinciaNascita: this.birthProvinceTit,
        titEffComuneResidenza: this.residenceCityTit,
        titEffProvinciaResidenza: this.residenceProvinceTit,
        titEffIndirizzoResidenza: this.residenceAddressTit,
        validitaInizio: null,
        entGestCfPiva: this.enteCf,
        welfareFasciaId: this.welfareFasciaId,
        rapLegVerificato: this.rapLegVerificato,
        entGestVerificato: this.entGestVerificato,
        titEffVerificato: this.titEffVerificato,
        rapLegInvariato: this.rapLegInvariato,
        entGestInvariato: this.entGestInvariato,
        strResInvariato: this.strResInvariato,
        titEffInvariato: this.titEffInvariato,
        fascia: [],
        files: []
      };
      for (let fascia of this.fasce) {
        let f = {
          strWelfFasciaId: fascia.strWelfFasciaId,
          welfareFasciaId: fascia.welfareFasciaId,
          tariffaMensileMassima: fascia.value
        };
        payload.fascia.push(f);
      }
      if (!this.firstFileNotRequired) {
        let file = {
          filename: this.firstFile.value.name,
          base64String: await file2Base64(this.firstFile.value),
          fileTipoId: this.firstFile.fileTipoId
        };
        payload.files.push(file);
      }
      this.isSaving = true;
      try {
        let promise = await createWelfareRequest(payload);
        this.isModalOpen = false;
        notifySuccess("Richiesta salvata correttamente");
        this.isLoading = false;
        this.getDati();
      } catch (e) {
        let r = e.response.data;
        let message = r.descrizione;
        notifyError(e, message);
        this.isModalOpen = false;
        this.isLoading = false;
      }
      this.isSaving = false;
    },
    async getDati() {
      let promise = await getWelfareRequest();
      let data = promise.data;
      this.response = promise.data;
      // this.rilevazioniPresenti = this.response.rilevazioniPresenti;
      this.rilevazioniPresenti = true;
      this.richiestaFinalizzata = this.response.richiestaFinalizzata;
      if (this.response.strWelfareId != null) {
        this.firstPhaseDone = true;
      }
      if (this.richiestaFinalizzata) {
        this.riempiDati();
      }
    },
    async downloadModulo() {
      let param = {
        codiceFiscale: this.response.utenteOperazione
      };
      let data = await downloadModulo(param);
    },
    async salvaAllegati() {
       this.isLoading = true;
      let payload = {
        strWelfareId: this.response.strWelfareId,
        files: []
      };
      for (let file of this.files) {
        let f = {
          filename: file.value.name,
          base64String: await file2Base64(file.value),
          fileTipoId: file.fileTipoId
        };
        payload.files.push(f);
      }

      try {
        let data = await createWelfareRequestForAllegato(payload);
        this.isSecondModalOpen = false;
        notifySuccess("Allegati salvati correttamente");
        this.getDati();
        this.isLoading = false;
      } catch (e) {
        let r = e.response.data;
        let message = r.descrizione;
        notifyError(e, message);
        this.isSecondModalOpen = false;
        this.isLoading = false;
      }
    },
    riempiDati() {
      this.cf = this.response.rapLegCodiceFiscale;
      this.lastName = this.response.rapLegCognome;
      this.name = this.response.rapLegNome;
      this.birthCity = this.response.rapLegComuneNascita;
      this.birthDate = formatDate(
        this.response.rapLegDataNascita,
        "YYYY-MM-DD"
      );
      this.birthProvince = this.response.rapLegProvinciaNascita;
      this.residenceCity = this.response.rapLegComuneResidenza;
      this.residenceProvince = this.response.rapLegProvinciaResidenza;
      this.residenceAddress = this.response.rapLegIndirizzoResidenza;
      this.email = this.response.rapLegEmail;
      this.mobile = this.response.rapLegCellulare;
      this.domicileAddress = this.response.rapLegIndirizzoDomicilio;
      this.domicileCity = this.response.rapLegComuneDomicilio;
      this.domicileProvince = this.response.rapLegProvinciaDomicilio;
      this.enteCf = this.response.entGestCfPiva;
      this.enteName = this.response.entGestRagioneSociale;
      this.enteCity = this.response.entGestComune;
      this.enteAddress = this.response.entGestIndirizzo;
      this.enteProvince = this.response.entGestProvincia;

      this.structureName = this.response.strResNome;
      this.structureType = this.response.strResTipologia;
      this.structureCity = this.response.strResComune;
      this.structureAddress = this.response.strResIndirizzo;
      this.structureProvince = this.response.strResProvincia;
      this.welfareFasciaId = this.response.welfareFasciaId;

      this.cfTit = this.response.titEffCodiceFiscale;
      this.lastNameTit = this.response.titEffCognome;
      this.nameTit = this.response.titEffNome;
      this.birthCityTit = this.response.titEffComuneNascita;
      this.birthDateTit = formatDate(
        this.response.titEffDataNascita,
        "YYYY-MM-DD"
      );
      this.birthProvinceTit = this.response.titEffProvinciaNascita;
      this.residenceCityTit = this.response.titEffComuneResidenza;
      this.residenceProvinceTit = this.response.titEffProvinciaResidenza;
      this.residenceAddressTit = this.response.titEffIndirizzoResidenza;
      this.fasceFinale = this.response.fascia;
    },
    showDelega() {
      openURL("/manualigescovid/rsa/mod_delega_legale_rappr_RSA.pdf");
    },
    confermaSicuro() {
      this.checkdCfIva = true;
      this.isModalSicuro = false;
    },
    setTwoNumberDecimal(i, event) {
      this.fasce[i].value = parseFloat(this.fasce[i].value).toFixed(2);
    },
    apriLink() {
      openURL("/manualigescovid/rsa/Atto_di_nomina_resp_esterni_RSA.pdf");
    }
  }
};
</script>

<style></style>
