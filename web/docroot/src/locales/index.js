import { en } from './en.js'
import { pt } from './pt.js'

const messages = {
    en: en,
    pt: pt,
}

const locales = {
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: messages
}

export { locales }