import { remove } from "lodash"
import { Volunteer } from "../../services/volunteers"

export function getUniqueNickname(list: Volunteer[], volunteer: Volunteer): string {
    const lastnameList = list
        .filter((v) => v.firstname === volunteer.firstname)
        .map((v) => v.lastname)
    let lastnamePrefix = ""
    while (lastnameList.length > 1) {
        lastnamePrefix += volunteer.lastname.charAt(lastnamePrefix.length)
        // eslint-disable-next-line no-loop-func
        remove(lastnameList, (lastname) => !lastname.startsWith(lastnamePrefix))
    }
    const nickname = `${volunteer.firstname}${lastnamePrefix ? ` ${lastnamePrefix}.` : ""}`
    return nickname
}
