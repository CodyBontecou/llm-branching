<script setup lang="ts">
import type { Node } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ref } from 'vue'

const { addNodes, addEdges } = useVueFlow()

const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'llm',
    position: { x: 250, y: 5 },
    data: { label: 'Node 1' },
  },
])

const onConnect = params => {
  addEdges([params])
}

const onRequestComplete = (responseData, sourcePosition) => {
  const newNodeId = `result-${Date.now()}`
  const newNode = {
    id: newNodeId,
    type: 'llm',
    position: { x: sourcePosition.x, y: sourcePosition.y + 100 },
  }

  addNodes([newNode])
  addEdges([{ id: `e1-${newNodeId}`, source: '1', target: newNodeId }])
}
</script>

<template>
  <VueFlow :nodes="nodes" @connect="onConnect">
    <Background />
    <template #node-llm="nodeProps">
      <LlmInputNode
        :node-props="nodeProps"
        :edit-mode="false"
        @request-complete="onRequestComplete"
      />
    </template>
  </VueFlow>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
</style>
