import React, { memo, useCallback } from "react"
import styles from "./styles.module.scss"

const RegisterForm = (): JSX.Element => {
    const onSubmit = useCallback((event: React.SyntheticEvent): void => {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            firstname: { value: string }
            lastname: { value: string }
            email: { value: string }
            phone: { value: string }
        }
        const firstname = target.firstname.value
        const lastname = target.lastname.value
        const email = target.email.value
        const phone = target.phone.value

        console.log("register fields checked", firstname, lastname, email, phone)

        // call service with fields
    }, [])

    /*
    prenom
    nom
    mail
    tel
    j'ai déjà été bénévole pour PEL
    un petit mot...
     */

    return (
        <form onSubmit={onSubmit}>
            <dl className={styles.registerIntro} key="register-intro">
                <dt>Qu&apos;est-ce que Paris est Ludique ?</dt>
                <dd>
                    <p>
                        Cette grande fête est dédiée aux <b>jeux de société modernes</b> sous toutes
                        leurs formes.
                    </p>
                    <p>
                        En 2019 lors de la dernière édition, ce sont <b>16 000</b> joueurs qui se
                        sont réunis sous 300 chapiteaux et 2 000 tables.
                    </p>
                    <p>
                        Les 2 jours que durent le festival sont entièrement dédiés à ce que le
                        public <b>JOUE</b>, que ce soit sur les stands d&apos;éditeurs,
                        d&apos;associations, d&apos;animateurs bénévoles, du coin des petits
                        joueurs, de l&apos;espace tournois, ou de l&apos;espace prototypes.
                    </p>
                </dd>
                <dt>Et les bénévoles de PeL ?</dt>
                <dd>
                    <p>
                        L&apos;organisation du festival est <b>entièrement gérée par nous</b>, les
                        bénévoles. À aucun moment ça ne doit devenir une corvée, donc nous faisons
                        tout pour passer <b>un aussi bon moment que les visiteurs</b> :)
                    </p>
                    <p>
                        C&apos;est pour ça que chaque mois, ceux qui sont dispo prennent
                        l&apos;apéro tous ensemble en jouant et discutant de l&apos;organisation.
                    </p>
                    <p>
                        Pendant le festival de 2019, nous étions <b>187 bénévoles</b> organisés en
                        équipes spécialisées qui chouchoutent les visiteurs en les accueillant, en
                        s&apos;assurant que tout se passe bien, ou en expliquant des règles de jeux.
                    </p>
                    <p>
                        Une équipe s&apos;occupe même du bien être des bénévoles en leur servant à
                        boire et à manger dans un espace à part où faire des pauses régulières.
                    </p>
                    <p>
                        Les deux jours avant et le jour après le festival, ceux qui le peuvent
                        viennent tout préparer et ranger. Certains ne sont disponibles que ces jours
                        là et c&apos;est déjà d&apos;une grande aide !
                    </p>
                    <p>
                        Nous nous arrangeons pour héberger les bénévoles qui habitent loin de Paris,
                        et certains ne viennent qu&apos;un seul jour du weekend pour être visiteur
                        l&apos;autre.
                    </p>
                    <p>
                        Le samedi soir, cerise sur le gâteau, nous prenons un{" "}
                        <b>dîner avec les auteurs, illustrateurs et éditeurs</b> qui sont présents
                        sur le festival !
                    </p>
                </dd>
                <dt>
                    Si l&apos;expérience vous tente, n&apos;hésitez pas à remplir le formulaire
                    suivant pour nous rencontrer lors d&apos;un des gros apéros mensuels !<br />
                    Les prochains sont les 21 décembre et 27 janvier, mais nous vous appelerons
                    d&apos;ici là pour discuter :)
                </dt>
                <dd>
                    <div className={styles.formLine} key="line-firstname">
                        <label htmlFor="firstname">Prénom</label>
                        <input type="text" id="firstname" />
                    </div>
                    <div className={styles.formLine} key="line-lastname">
                        <label htmlFor="lastname">Nom</label>
                        <input type="text" id="lastname" />
                    </div>
                    <div className={styles.formLine} key="line-email">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" />
                    </div>
                    <div className={styles.formLine} key="line-phone">
                        <label htmlFor="phone">Téléphone</label>
                        <input type="text" id="phone" />
                    </div>
                    <div className={styles.formLine} key="line-already-volunteer">
                        <div>
                            J&apos;ai déjà été bénévole
                            <input
                                type="radio"
                                name="alreadyVolunteer"
                                id="alreadyVolunteer-yes"
                                className={styles.inputRadio}
                            />
                            <label htmlFor="alreadyVolunteer-yes">Oui</label>
                            <input
                                type="radio"
                                name="alreadyVolunteer"
                                id="alreadyVolunteer-no"
                                className={styles.inputRadio}
                            />
                            <label htmlFor="alreadyVolunteer-no">Non</label>
                        </div>
                    </div>
                    <div className={styles.formLine} key="line-message">
                        <textarea
                            name="message"
                            id="message"
                            placeholder="Des petits mots sympas, questions, envies, des infos sur toi, des compétences dont tu aimerais te servir... ou rien de tout ça et nous en discuterons au téléphone :)"
                        />
                    </div>
                    <div className={styles.formButtons}>
                        <button type="submit">Envoyer</button>
                    </div>
                </dd>
            </dl>
        </form>
    )
}

export default memo(RegisterForm)
