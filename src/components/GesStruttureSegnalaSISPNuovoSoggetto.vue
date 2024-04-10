<!--
  - Copyright Regione Piemonte - 2023
  - SPDX-License-Identifier: EUPL-1.2
  -->

<template>
  <div>
    <q-card-section>
      <div class="text-h6">Segnale al SISP</div>
    </q-card-section>
    <q-toggle
      v-model="sintomi"
      label="Sintomi"
    />
    <q-form ref="sintomi" v-if="sintomi">
      <div class="q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <q-input
          v-model="dataEsordioSintomi"
          type="date"
          label="Data esordio sintomi malattia*"
          stack-label
          filled
          dense
          no-error-icon
        />
      </div>
      <div class="q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <q-input
          v-model="temperatura"
          type="number"
          label="Temperatura"
          stack-label
          filled
          dense
          no-error-icon
        />
      </div>
      <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <strong class="col-3">Tosse:</strong>
        <q-radio v-model="tosse" val="No" label="No" />
        <q-radio v-model="tosse" val="Non persistente" label="Non persistente" />
        <q-radio v-model="tosse" val="Persistente grassa" label="Persistente grassa" />
        <q-radio v-model="tosse" val="Persistente secca" label="Persistente secca" />
      </div>
      <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <strong class="col-3">Dispnea:</strong>
        <q-radio v-model="dispnea" val="No" label="No" />
        <q-radio v-model="dispnea" val="Si" label="Si" />
      </div>
      <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <strong class="col-3">Disturbi gastrointestinali (diarrea, nausea, vomito):</strong>
        <q-radio v-model="gastroIntestinali" val="No" label="No" />
        <q-radio v-model="gastroIntestinali" val="Si" label="Si" />
      </div>
      <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <strong class="col-3">Congiuntivite bilaterale:</strong>
        <q-radio v-model="congiuntivite" val="No" label="No" />
        <q-radio v-model="congiuntivite" val="Si" label="Si" />
      </div>
      <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <strong class="col-3">Dolori osteomuscolari diffusi:</strong>
        <q-radio v-model="doloriOsteomuscolari" val="No" label="No" />
        <q-radio v-model="doloriOsteomuscolari" val="Prima emergenza" label="Prima emergenza" />
        <q-radio v-model="doloriOsteomuscolari" val="Ultime due settimane" label="Ultime due settimane" />
      </div>
      <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <strong class="col-3">Ageusia:</strong>
        <q-radio v-model="ageusia" val="No" label="No" />
        <q-radio v-model="ageusia" val="Si" label="Si" />
      </div>
      <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <strong class="col-3">Anosmia:</strong>
        <q-radio v-model="anosmia" val="No" label="No" />
        <q-radio v-model="anosmia" val="Si" label="Si" />
      </div>
      <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <strong class="col-3">Rinorrea:</strong>
        <q-radio v-model="rinorrea" val="No" label="No" />
        <q-radio v-model="rinorrea" val="Leggero" label="Leggero" />
        <q-radio v-model="rinorrea" val="Forte" label="Forte" />
      </div>
      <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <strong class="col-3">Astenia severa:</strong>
        <q-radio v-model="astenia" val="No" label="No" />
        <q-radio v-model="astenia" val="Nella norma" label="Nella norma" />
        <q-radio v-model="astenia" val="PiÃ¹ del solito" label="PiÃ¹ del solito" />
      </div>
      <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <strong class="col-3">Cefalea:</strong>
        <q-radio v-model="cefalea" val="No" label="No" />
        <q-radio v-model="cefalea" val="Si" label="Si" />
      </div>
      <div class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <strong class="col-3">Faringodinia:</strong>
        <q-radio v-model="faringodinia" val="No" label="No" />
        <q-radio v-model="faringodinia" val="Si" label="Si" />
      </div>
      <q-input
        filled
        class="q-ml-sm q-mr-sm q-mt-sm q-mb-lg"
        dense
        label="Altri sintomi"
        v-model="nomeSintomo"
      >
      </q-input>
    </q-form>
    <q-form ref="formsegnala">
      <q-input
        :rules="[ruleRequired]"
        filled
        class="q-ml-sm q-mr-sm q-mt-sm q-mb-sm"
        dense
        label="Condizioni cliniche*"
        v-model="condizioniCliniche"
      >
      </q-input>
      <q-input
        :rules="[ruleRequired]"
        filled
        class="q-ml-sm q-mr-sm q-mt-sm q-mb-sm"
        dense
        label="Luogo paziente*"
        v-model="luogo"
      >
      </q-input>
      <q-input
        :rules="[ruleRequired]"
        filled
        class="q-ml-sm q-mr-sm q-mt-sm q-mb-sm"
        dense
        label="Contesto - contatto*"
        v-model="contesto"
      >
      </q-input>
      <!--q-item-label class="q-ml-sm">Luogo prelievo preposto</q-item-label>
      <div class="q-gutter-sm">
        <q-radio v-model="luogoPrelievo" val="Drive in" label="Drive in" />
        <q-radio v-model="luogoPrelievo" val="Domicilio" label="Domicilio" />
        <q-radio v-model="luogoPrelievo" val="Non espresso" label="Non espresso" />
      </div -->
    </q-form>
  </div>
</template>

<script>
import { segnalaSisp } from 'src/services/api'

export default {
  name: 'GesStruttureSegnalaSISPNuovoSoggetto',
  data () {
    return {
      sintomi: false,
      condizioniCliniche: '',
      luogo: '',
      contesto: '',
      luogoPrelievo: '',
      dataEsordioSintomi: '',
      temperatura: '',
      // SINTOMI
      tosse: 'No',
      dispnea: 'No',
      gastroIntestinali: 'No',
      congiuntivite: 'No',
      doloriOsteomuscolari: 'No',
      ageusia: 'No',
      anosmia: 'No',
      rinorrea: 'No',
      astenia: 'No',
      cefalea: 'No',
      faringodinia: 'No',
      nomeSintomo: ''
    }
  },
  computed: {
    ruleRequired () {
      return v => !!v || 'Campo obbligatorio'
    }
  },
  methods: {
    async isValid () {
      const isValid = await this.$refs.formsegnala.validate()
      return isValid
    },
    async segnala (idSoggetto) {
      const isValid = await this.$refs.formsegnala.validate()
      if (isValid) {
        let sintomi = 'NO'
        let sintomo = null
        let dataSint = null
        if (this.sintomi) {
          sintomi = 'SI'
          sintomo = {
            flgCefalea: this.cefalea.toUpperCase().replaceAll(' ', '_'),
            flgCongiuntivite: this.congiuntivite.toUpperCase().replaceAll(' ', '_'),
            flgDiarrea: this.gastroIntestinali.toUpperCase().replaceAll(' ', '_'),
            flgDispnea: this.dispnea.toUpperCase().replaceAll(' ', '_'),
            flgDoloriMusc: this.doloriOsteomuscolari.toUpperCase().replaceAll(' ', '_'),
            flgFaringodinia: this.faringodinia.toUpperCase().replaceAll(' ', '_'),
            flgGusto: this.ageusia.toUpperCase().replaceAll(' ', '_'),
            flgOlfatto: this.anosmia.toUpperCase().replaceAll(' ', '_'),
            flgRaffreddore: this.rinorrea.toUpperCase().replaceAll(' ', '_'),
            flgStanchezza: this.astenia.toUpperCase().replaceAll(' ', '_').replace('PIÃ_DEL_SOLITO', 'PIU_SOLITO'),
            flgTosse: this.tosse.toUpperCase().replaceAll(' ', '_'),
            noteSintomo: this.nomeSintomo,
            temperatura: this.temperatura
          }
          dataSint = this.dataEsordioSintomi
        }
        const decorso = {
          condizioniCliniche: this.condizioniCliniche,
          dataInizioSint: dataSint,
          descrizioneContesto: this.contesto,
          luogoPaziente: this.luogo,
          sintomi: sintomi,
          sintomo: sintomo
        }
        const payload = {
          idSoggetto: idSoggetto,
          decorso: decorso
        }
        try {
          await segnalaSisp(payload)
          this.condizioniCliniche = ''
          this.luogo = ''
          this.contesto = ''
          this.dataEsordioSintomi = ''
          this.temperatura = ''
          this.tosse = 'No'
          this.dispnea = 'No'
          this.gastroIntestinali = 'No'
          this.congiuntivite = 'No'
          this.doloriOsteomuscolari = 'No'
          this.ageusia = 'No'
          this.anosmia = 'No'
          this.rinorrea = 'No'
          this.astenia = 'No'
          this.cefalea = 'No'
          this.faringodinia = 'No'
          this.nomeSintomo = ''
          this.$emit('aggiorna-sisp')
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
