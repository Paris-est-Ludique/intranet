import { FC, memo, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import classnames from "classnames"
import { get, set } from "lodash"
import styles from "./styles.module.scss"
import { useUserPersonalInfo } from "../personalInfo.utils"
import FormButton from "../../Form/FormButton/FormButton"
import { fetchVolunteerPersonalInfoSetIfNeed } from "../../../store/volunteerPersonalInfoSet"
import IgnoreButton from "../../Form/IgnoreButton/IgnoreButton"

type Props = {
    children?: ReactNode | undefined
    afterSubmit?: () => void | undefined
}

const PersonalInfoForm: FC<Props> = ({ children, afterSubmit }): JSX.Element => {
    const firstnameRef = useRef<HTMLInputElement | null>(null)
    const lastnameRef = useRef<HTMLInputElement | null>(null)
    const [photo, setPhoto] = useState("")
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [userWishes, saveWishes] = useUserPersonalInfo()

    useEffect(() => {
        if (!userWishes) return
        set(firstnameRef, "current.value", get(userWishes, "firstname", ""))
        set(lastnameRef, "current.value", get(userWishes, "lastname", ""))
        setPhoto(get(userWishes, "photo", ""))
    }, [userWishes])

    const onChoiceSubmit = useCallback(() => {
        const firstname = get(firstnameRef, "current.value", "")
        const lastname = get(lastnameRef, "current.value", "")
        const reader = new FileReader()
        reader.onload = async (event) => {
            const photoData = event?.target?.result as string
            if (!photoData) {
                throw Error("Ce n'est pas une photo valide")
            }
            saveWishes(firstname, lastname, photoData)
            if (afterSubmit) afterSubmit()
        }
        if (selectedImage) {
            reader.readAsDataURL(selectedImage)
        } else {
            saveWishes(firstname, lastname, undefined)
            if (afterSubmit) afterSubmit()
        }
    }, [selectedImage, saveWishes, afterSubmit])

    return (
        <div>
            <div className={styles.title}>Mes infos personnelles</div>

            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.firstnameTitle}>Prénom :</div>
                </div>
                <div className={styles.rightCol}>
                    <input className={styles.firstnameLabel} type="text" ref={firstnameRef} />
                </div>
            </div>

            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.lastnameTitle}>Nom :</div>
                </div>
                <div className={styles.rightCol}>
                    <input className={styles.lastnameLabel} type="text" ref={lastnameRef} />
                </div>
            </div>

            <div className={classnames(styles.inputWrapper, styles.noBottomMargin)}>
                <div className={styles.leftCol}>
                    <div className={styles.photoTitle}>
                        Ta photo de profil pour le trombinoscope de l'association :
                    </div>
                </div>
                <div className={styles.rightCol}>
                    <label className={styles.photoLabel}>
                        {/^[0-9]/.test(photo || "") && !selectedImage && (
                            <div>
                                <img alt="actuelle" width="100px" src={`/photos/${photo}`} />
                            </div>
                        )}
                        {selectedImage && (
                            <div>
                                <img
                                    alt="remplacement"
                                    width="100px"
                                    src={URL.createObjectURL(selectedImage)}
                                />
                            </div>
                        )}
                        <br />

                        <input
                            type="file"
                            name="myImage"
                            onChange={(event) => {
                                console.log(event?.target?.files?.[0])
                                setSelectedImage(event?.target?.files?.[0] || null)
                            }}
                        />
                    </label>
                </div>
            </div>

            <div className={styles.inputWrapper}>
                <div>
                    En tant que bénévole pour le festival, tu es automatiquement membre adhérent de
                    l'association Paris est Ludique ! pour avoir droit de regard sur son
                    fonctionnement. Aucune cotisation n'est demandée et aucun engagement autre
                    qu'être bénévole pendant le festival n'est nécessaire. Les statuts sont{" "}
                    <a
                        href="https://drive.google.com/file/d/1KJIJxZmDdJ_PBKJSh_W3yrHLzH0-awsE/view?usp=sharing"
                        target="_blank"
                        rel="noreferrer"
                    >
                        accessibles ici
                    </a>
                    .
                </div>
            </div>

            <div className={styles.buttonWrapper}>
                <FormButton onClick={onChoiceSubmit}>Enregistrer</FormButton>
                {children === undefined && (
                    <>
                        {" "}
                        <FormButton onClick={afterSubmit} type="grey">
                            Annuler
                        </FormButton>{" "}
                    </>
                )}
                {children !== undefined && (
                    <>
                        {" "}
                        <IgnoreButton onClick={afterSubmit} text="Ignorer">
                            {children}
                        </IgnoreButton>{" "}
                    </>
                )}
            </div>
        </div>
    )
}

PersonalInfoForm.defaultProps = {
    children: undefined,
    afterSubmit: undefined,
}

export default memo(PersonalInfoForm)

// Fetch server-side data here
export const fetchFor = [fetchVolunteerPersonalInfoSetIfNeed]
