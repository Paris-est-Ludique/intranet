export function canonicalEmail(email: string): string {
    email = email.replace(/^\s+|\s+$/g, "")
    if (/@gmail.com$/.test(email)) {
        let domain = email.replace(/^.*@/, "")
        domain = domain.replace(/^googlemail%.com$/, "gmail.com")
        email = email
            .replace(/\./g, "")
            .replace(/^[^@]+/, (match) => match.toLowerCase())
            .replace(/@.*$/, `@${domain}`)
    }
    return email.toLowerCase()
}

export function validEmail(email: string): boolean {
    return /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/.test(
        email
    )
}
