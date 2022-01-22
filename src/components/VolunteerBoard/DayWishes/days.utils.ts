const daysUtils = ["Jeudi", "Vendredi", "Samedi", "Dimanche", "Lundi"]

export const daysChoice = daysUtils.map((label) => ({
    id: label[0],
    label,
}))

interface selectionChoices {
    [key: string]: boolean
}

export const daysChoiceSelectionDefaultState = daysChoice.reduce((state, { id }) => {
    state[id] = false
    return state
}, <selectionChoices>{})
