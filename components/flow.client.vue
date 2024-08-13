<script setup lang="ts">
import {
  VueFlow,
  useVueFlow,
  type Node,
  type Edge,
  type Connection,
  type OnConnectStartParams,
  Position,
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { provide, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const verticalSpacing = 175
const { addNodes, addEdges, getNode, getEdges } = useVueFlow()

const draggedNode = ref(null)
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

const createNewNode = (
  sourceId: string,
  sourceHandle: string | null | undefined,
  position?: { x: number; y: number }
): Node => {
  return {
    id: `node-${Date.now()}`,
    type: 'llm',
    position: position || { x: 0, y: 0 },
    data: { label: 'New Node' },
  }
}

const onConnect = ({
  source,
  target,
  sourceHandle,
  targetHandle,
}: Connection) => {
  if (!target) {
    const newNode = createNewNode(source, sourceHandle)
    addNodes([newNode])
    addEdges([{ id: `e${source}-${newNode.id}`, source, target: newNode.id }])
  } else {
    addEdges([
      {
        id: `e${source}-${target}`,
        source,
        target,
        sourceHandle,
        targetHandle,
      },
    ])
  }
}

const onConnectStart = ({
  event,
  nodeId,
  handleType,
}: {
  event: MouseEvent
  nodeId: string
  handleType: string
}) => {
  if (handleType === 'target') {
    draggedNode.value = nodeId
  }
}

const onConnectEnd = (event: MouseEvent) => {
  if (draggedNode.value) {
    const targetPosition = {
      x: event.clientX,
      y: event.clientY,
    }
    const newNode = createNewNode(draggedNode.value, null, targetPosition)
    addNodes([newNode])
    addEdges([
      {
        id: `e${draggedNode.value}-${newNode.id}`,
        source: draggedNode.value,
        target: newNode.id,
      },
    ])
    draggedNode.value = null
  }
}

const createResultNode = (
  responseData: any,
  sourceNodeId: string,
  sourcePosition: { x: number; y: number }
) => {
  const newNodeId = `result-${sourceNodeId}}`
  const nodeType = 'llmResult'
  const newNode: Node = {
    id: newNodeId,
    type: nodeType,
    position: {
      x: sourcePosition.x,
      y: sourcePosition.y + verticalSpacing,
    },
    data: { response: responseData },
  }

  addNodes([newNode])

  const newEdge: Edge = {
    id: `e-${sourceNodeId}-${newNodeId}`,
    source: sourceNodeId,
    target: newNodeId,
    updatable: true,
    sourceHandle: Position.Top,
    targetHandle: Position.Bottom,
  }

  addEdges([newEdge])

  return newNode
}

const createLlmNode = (
  sourceNodeId: string,
  sourcePosition: { x: number; y: number }
) => {
  const nodeType = 'llm'

  const newNode: Node = {
    id: uuidv4(),
    type: nodeType,
    position: {
      x: sourcePosition.x,
      y: sourcePosition.y + verticalSpacing,
    },
  }

  addNodes([newNode])

  const newEdge: Edge = {
    id: `e-${sourceNodeId}-${newNode.id}`,
    source: sourceNodeId,
    target: newNode.id,
    updatable: true,
    sourceHandle: Position.Top,
    targetHandle: Position.Bottom,
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
  <VueFlow
    :nodes="nodes"
    @connect="onConnect"
    @connectStart="onConnectStart"
    @connectEnd="onConnectEnd"
  >
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
