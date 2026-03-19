<template>
  <div class="todo-item">
    <div class="todo-main">
      <div class="todo-title">{{ todo.title }}</div>
      <el-tag :type="tagType" effect="plain">{{ prettyStatus }}</el-tag>
    </div>

    <div class="todo-actions">
      <!-- todo -> blocked/done -->
      <template v-if="todo.status === 'todo'">
        <el-button :disabled="saving" type="primary" @click="emitChange('blocked')">Blocked</el-button>
        <el-button :disabled="saving" type="success" @click="emitChange('done')">Done</el-button>
      </template>

      <!-- blocked -> done -->
      <template v-else-if="todo.status === 'blocked'">
        <el-button :disabled="saving" type="success" @click="emitChange('done')">Done</el-button>
      </template>

      <!-- done -> transform -> todo/blocked -->
      <template v-else-if="todo.status === 'done'">
        <el-dropdown trigger="click" placement="bottom-end" @command="selectTransform">
          <span class="transform-wrap">
            <el-button :disabled="saving" type="info">Transform</el-button>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="todo">Todo</el-dropdown-item>
              <el-dropdown-item command="blocked">Blocked</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  todo: {
    type: Object,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['changeStatus']);

const prettyStatus = computed(() => {
  const s = props.todo.status;
  if (s === 'todo') return 'Todo';
  if (s === 'blocked') return 'Blocked';
  if (s === 'done') return 'Done';
  return String(s || '');
});

const tagType = computed(() => {
  const s = props.todo.status;
  if (s === 'todo') return 'warning';
  if (s === 'blocked') return 'info';
  if (s === 'done') return 'success';
  return 'info';
});

function emitChange(nextStatus) {
  emit('changeStatus', nextStatus);
}

function selectTransform(nextStatus) {
  emitChange(nextStatus);
}
</script>

