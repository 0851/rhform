import { addDecorator, configure } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import "../../src/style.less"

const req = require.context('../src', true, /.tsx$/)

function loadStories () {
  req.keys().forEach(req)
}

addDecorator(withKnobs)
configure(loadStories, module)
