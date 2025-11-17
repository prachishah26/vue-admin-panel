<script setup>
import { useAuthStore } from '@/stores/auth';
import logo from '@images/logo.svg?raw';
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png';
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png';
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png';
import authV1Tree from '@images/pages/auth-v1-tree.png';
import { Field, Form as VeeForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import * as yup from 'yup';

const vuetifyTheme = useTheme();
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const isPasswordVisible = ref(false);
const submitting = ref(false);
const errorMessage = ref('');

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark;
});

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  remember: yup.boolean().optional(),
});

const form = {
  email: '',
  password: '',
  remember: false,
};

async function onSubmit(values) {
  errorMessage.value = '';
  submitting.value = true;

  try {
    await auth.login({ email: values.email, password: values.password });
    
    // Wait for next tick to ensure Pinia persistence is complete
    await nextTick()
    
    const redirect = (route.query.redirect && String(route.query.redirect)) || '/dashboard';
    router.replace(redirect);
  }
  catch (e) {
    errorMessage.value = e?.message || 'Login failed';
  }
  finally {
    submitting.value = false;
  }
}
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <RouterLink
          to="/"
          class="d-flex align-center gap-3"
        >
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="d-flex"
            v-html="logo"
          />
          <h2 class="font-weight-medium text-2xl text-uppercase">
            Materio
          </h2>
        </RouterLink>
      </VCardItem>

      <VCardText class="pt-2">
        <h4 class="text-h4 mb-1">
          Welcome to Materio! 👋🏻
        </h4>
        <p class="mb-0">
          Please sign-in to your account and start the adventure
        </p>
      </VCardText>

      <VCardText>
        <VeeForm
          :initial-values="form"
          :validation-schema="schema"
          @submit="onSubmit"
        >
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <Field
                name="email"
                v-slot="{ field, errors }"
              >
                <VTextField
                  label="Email"
                  type="email"
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :error-messages="errors"
                />
              </Field>
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <Field
                name="password"
                v-slot="{ field, errors }"
              >
                <VTextField
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :error-messages="errors"
                />
              </Field>

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap my-6">
                <Field name="remember" v-slot="{ field }">
                  <VCheckbox
                    :model-value="field.value"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                    label="Remember me"
                    hide-details
                    density="comfortable"
                  />
                </Field>

                <a
                  class="text-primary"
                  href="javascript:void(0)"
                >
                  Forgot Password?
                </a>
              </div>

              <VAlert
                v-if="errorMessage"
                type="error"
                class="mb-4"
                density="comfortable"
                variant="tonal"
              >
                {{ errorMessage }}
              </VAlert>

              <!-- login button -->
              <VBtn
                block
                type="submit"
                :loading="submitting"
              >
                Login
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>New on our platform?</span>
              <RouterLink
                class="text-primary ms-2"
                to="/register"
              >
                Create an account
              </RouterLink>
            </VCol>

          </VRow>
        </VeeForm>
      </VCardText>
    </VCard>

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
