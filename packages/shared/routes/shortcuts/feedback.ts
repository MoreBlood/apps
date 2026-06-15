import * as feedback from '@/routes/app/feedback'
import { bindShortcutRoute } from '@/routes/bind-shortcut-route'

const shortcut = bindShortcutRoute(feedback)

export const generateMetadata = shortcut.generateMetadata
export default shortcut.default
