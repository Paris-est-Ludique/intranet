import React from "react"

const KnowledgeIntro: React.FC = (): JSX.Element => (
    <div>
        <h1>Tes connaissances en jeux</h1>
        <p>
            Lors du festival, si tu es aux Jeux à Volonté, il sera très utile de savoir qui peut
            expliquer quoi. Ce sera même indiqué dans chaque boîte de jeu ! Mais pour ça il faut que
            tu nous dises à quel point tu peux les expliquer.
        </p>
        <p>
            OK signifie que tu peux expliquer le jeu, avec au maximum un coup d'oeil aux règles sur
            un nombre de cartes à distribuer, ou un nombre de PV déclencheur de fin de partie.
            <br />
            Bof signifie que tu seras plus utile que la lecture des règles.
        </p>
    </div>
)

export default KnowledgeIntro
