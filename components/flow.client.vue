<script setup lang="ts">
import type { Edge, Node } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ref } from 'vue'

const { addNodes, addEdges, getNode } = useVueFlow()

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

const createResultNode = (
  responseData: any,
  sourceNodeId: string,
  sourcePosition: { x: number; y: number }
) => {
  const newNodeId = `result-${sourceNodeId}}`
  const newNode: Node = {
    id: newNodeId,
    type: 'llmResult',
    position: {
      x: sourcePosition.x,
      y: sourcePosition.y + 200,
    },
    data: { response: responseData },
  }

  addNodes([newNode])

  const newEdge: Edge = {
    id: `e-${sourceNodeId}-${newNodeId}`,
    source: sourceNodeId,
    target: newNodeId,
  }

  addEdges([newEdge])

  return newNodeId
}

const onRequestComplete = (
  data: any,
  sourceNodeId: string,
  sourcePosition: { x: number; y: number }
) => {
  const newNodeId = createResultNode(data, sourceNodeId, sourcePosition)
  return newNodeId
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

    <template #node-llmResult="nodeProps">
      <LlmResultNode :node-props="nodeProps" />
    </template>
  </VueFlow>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
</style>
