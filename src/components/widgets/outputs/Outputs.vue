<template>
  <v-card-text>
    <v-row>
      <v-col cols="12" md="6">
        <template v-for="(item, i) in all.col1">
          <OutputItem
            :key="item.key"
            :item="item"
          >
          </OutputItem>

          <v-divider
            v-if="i < all.col1.length - 1 || $vuetify.breakpoint.mdAndDown"
            :key="`divider-0${i}`"
            class="my-2">
          </v-divider>
        </template>
      </v-col>
      <v-col cols="12" md="6">
        <template v-for="(item, i) in all.col2">
          <OutputItem
            :key="item.key"
            :item="item"
          >
          </OutputItem>

          <v-divider
            v-if="i < all.col2.length - 1"
            :key="`divider-1${i}`"
            class="my-2">
          </v-divider>
        </template>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import OutputItem from '@/components/widgets/outputs/OutputItem.vue'
import StateMixin from '@/mixins/state'
import { Fan, OutputPin } from '@/store/printer/types'

@Component({
  components: {
    OutputItem
  }
})
export default class Outputs extends Mixins(StateMixin) {
  get all () {
    const items: Array<Fan | OutputPin> = [
      ...this.$store.getters['printer/getAllFans'],
      ...this.$store.getters['printer/getPins'],
      ...this.$store.getters['printer/getAllLeds']
    ]
    let col1: Array<Fan | OutputPin> = []
    let col2: Array<Fan | OutputPin> = []
    if (items.length > 1) {
      const half = Math.ceil(items.length / 2)
      col1 = items.splice(0, half)
      col2 = items
    } else {
      col1 = items
    }
    return {
      col1,
      col2
    }
  }
}
</script>
