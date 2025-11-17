<script setup>
import { useAuthStore } from '@/stores/auth';
import { validatePassword } from '@/utils/passwordValidation';
import logo from '@images/logo.svg?raw';
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png';
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png';
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png';
import authV1Tree from '@images/pages/auth-v1-tree.png';
import { Field, Form as VeeForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import * as yup from 'yup';

const vuetifyTheme = useTheme();
const auth = useAuthStore();
const router = useRouter();

const isPasswordVisible = ref(false);
const submitting = ref(false);
const errorMessage = ref('');

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark;
});

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .test('password-requirements', function (value) {
      if (!value) return this.createError({ message: 'Password is required' })
      const validation = validatePassword(value)
      if (!validation.isValid) {
        return this.createError({ message: validation.error })
      }
      return true
    }),
  privacyPolicies: yup.boolean().oneOf([true], 'You must accept the policy'),
});

const form = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  privacyPolicies: false,
};

async function onSubmit(values) {
  errorMessage.value = '';
  submitting.value = true;

  try {
    await auth.register(values);
    router.replace('/dashboard');
  }
  catch (e) {
    errorMessage.value = e?.message || 'Registration failed';
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
          Adventure starts here 🚀
        </h4>
        <p class="mb-0">
          Make your app management easy and fun!
        </p>
      </VCardText>

      <VCardText>
        <VeeForm
          :initial-values="form"
          :validation-schema="schema"
          @submit="onSubmit"
        >
          <VRow>
            <!-- First Name -->
            <VCol
              cols="12"
              md="6"
            >
              <Field
                name="firstName"
                v-slot="{ field, errors }"
              >
                <VTextField
                  label="First Name"
                  placeholder="John"
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :error-messages="errors"
                />
              </Field>
            </VCol>

            <!-- Last Name -->
            <VCol
              cols="12"
              md="6"
            >
              <Field
                name="lastName"
                v-slot="{ field, errors }"
              >
                <VTextField
                  label="Last Name"
                  placeholder="Doe"
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :error-messages="errors"
                />
              </Field>
            </VCol>

            <!-- email -->
            <VCol cols="12">
              <Field
                name="email"
                v-slot="{ field, errors }"
              >
                <VTextField
                  label="Email"
                  placeholder="johndoe@email.com"
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
              <Field name="privacyPolicies" v-slot="{ field, errors }">
                <VCheckbox
                  class="my-2"
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :error-messages="errors"
                  hide-details="auto"
                  density="comfortable"
                >
                  <template #label>
                    <span
                      class="me-1"
                      style="color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))"
                    >I agree to</span>
                    <a
                      href="javascript:void(0)"
                      class="text-primary"
                    >privacy policy & terms</a>
                  </template>
                </VCheckbox>
              </Field>

              <VAlert
                v-if="errorMessage"
                type="error"
                class="mb-4"
                density="comfortable"
                variant="tonal"
              >
                {{ errorMessage }}
              </VAlert>

              <VBtn
                block
                type="submit"
                :loading="submitting"
              >
                Sign up
              </VBtn>
            </VCol>

            <!-- login instead -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>Already have an account?</span>
              <RouterLink
                class="text-primary ms-2"
                to="login"
              >
                Sign in instead
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
