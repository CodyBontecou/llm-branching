<script setup lang="ts">
import type { Edge, Node } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const { addNodes, addEdges, getNode, getEdges } = useVueFlow()

const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'llm',
    position: { x: 250, y: 5 },
    data: { label: 'Node 1' },
  },
])

const getConversationHistory = (nodeId: string) => {
  const history = []
  let currentNodeId: string | null = nodeId

  while (currentNodeId) {
    const currentNode = getNode.value(currentNodeId)
    if (currentNode && currentNode.data.content) {
      history.unshift({
        role: 'user',
        content: currentNode.data.content,
      })
    } else if (currentNode && currentNode.data.response) {
      history.unshift({
        role: 'assistant',
        content: currentNode.data.response.choices[0].message.content,
      })
    }

    const incomingEdge = getEdges.value.find(
      edge => edge.target === currentNodeId
    )

    currentNodeId = incomingEdge ? incomingEdge.source : null
  }

  return history
}

// Provide the getConversationHistory function to child components
provide('getConversationHistory', getConversationHistory)

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

  return newNode
}

const createLlmNode = (
  sourceNodeId: string,
  sourcePosition: { x: number; y: number }
) => {
  const newNode: Node = {
    id: uuidv4(),
    type: 'llm',
    position: {
      x: sourcePosition.x,
      y: sourcePosition.y + 200,
    },
  }

  addNodes([newNode])

  const newEdge: Edge = {
    id: `e-${sourceNodeId}-${newNode.id}`,
    source: sourceNodeId,
    target: newNode.id,
  }

  addEdges([newEdge])
}

const onRequestComplete = (
  data: any,
  sourceNodeId: string,
  sourcePosition: { x: number; y: number }
) => {
  const newNode = createResultNode(data, sourceNodeId, sourcePosition)
  createLlmNode(newNode.id, newNode.position)
  return newNode
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
