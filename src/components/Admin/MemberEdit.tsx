import { isFinite } from "lodash"
import { FC, memo, useState } from "react"
import withUserConnected from "../../utils/withUserConnected"
import withUserRole from "../../utils/withUserRole"
import ROLES from "../../utils/roles.constants"
import { Volunteer } from "../../services/volunteers"
import styles from "./styles.module.scss"
import { toastError } from "../../store/utils"

interface Props {
    volunteer: Volunteer
    saveVolunteer: (newVolunteer: Partial<Volunteer>) => void
}

const MemberEdit: FC<Props> = ({ volunteer, saveVolunteer }): JSX.Element => {
    const [localVolunteer, setLocalVolunteer] = useState(volunteer)

    const stringDispatch =
        (propName: string) =>
        (e: React.ChangeEvent<HTMLInputElement>): void => {
            saveVolunteer({ id: localVolunteer.id, [propName]: e.target.value })
            setLocalVolunteer({ ...localVolunteer, [propName]: e.target.value })
        }

    function stringInput(id: string, value: string): JSX.Element {
        return (
            <div key={id} className={styles.inputContainer}>
                <span className={styles.inputDesc}>{id}</span>
                <br />
                <input
                    type="text"
                    id={id}
                    value={value}
                    onChange={stringDispatch(id)}
                    className={styles.stringInput}
                />
            </div>
        )
    }

    const numberDispatch =
        (propName: string) =>
        (e: React.ChangeEvent<HTMLInputElement>): void => {
            const value: number = +e.target.value
            if (!isFinite(value)) {
                toastError("Should be a number")
                return
            }
            saveVolunteer({ id: localVolunteer.id, [propName]: +value })
            setLocalVolunteer({ ...localVolunteer, [propName]: +value })
        }

    function numberInput(id: string, value: number): JSX.Element {
        return (
            <div key={id} className={styles.inputContainer}>
                <span className={styles.inputDesc}>{id}</span>
                <br />
                <input
                    type="text"
                    id={id}
                    value={value}
                    onChange={numberDispatch(id)}
                    className={styles.numberInput}
                />
            </div>
        )
    }

    const booleanDispatch =
        (propName: string) =>
        (e: React.ChangeEvent<HTMLInputElement>): void => {
            const value: boolean = e.target.value !== "0" && e.target.value !== ""
            saveVolunteer({ id: localVolunteer.id, [propName]: value })
            setLocalVolunteer({ ...localVolunteer, [propName]: value })
        }

    function booleanInput(id: string, value: boolean): JSX.Element {
        return (
            <div key={id} className={styles.inputContainer}>
                <span className={styles.inputDesc}>{id}</span>
                <br />
                <input
                    type="text"
                    id={id}
                    value={value ? "X" : ""}
                    onChange={booleanDispatch(id)}
                    className={styles.booleanInput}
                />
            </div>
        )
    }

    const volunteerDefault = new Volunteer()
    const typeHandler: { [id: string]: (id: string, value: any) => JSX.Element } = {
        string: stringInput,
        number: numberInput,
        boolean: booleanInput,
    }
    const keys = Object.keys(volunteerDefault) as (keyof Volunteer)[]

    return (
        <li className={styles.item} key={volunteer.id}>
            {keys.map((key) => {
                const valueType = typeof volunteerDefault[key]
                const value = localVolunteer[key]
                return (
                    typeHandler[valueType as string]?.(key, value as any) ||
                    stringInput(key, value as any)
                )
            })}
        </li>
    )
}

export default withUserRole(ROLES.ADMIN, memo(withUserConnected(MemberEdit)))

export const fetchFor = []
