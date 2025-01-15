import { useNavigate } from "react-router-dom"
import styles from "./RoomCard.module.css"

const RoomCard = ({room}) => {
  const navigate = useNavigate()

  return (
    <div className={styles.card} onClick={() => navigate(`/room/${room.id}`)}>
      <h3 className={styles.topic}>{room.topic}</h3>

      <div className={`${styles.speakers} ${room.speakers.length === 1 && styles.singleSpeaker}`}>

            <div className={styles.avatars}>
              {
                room.speakers.map(speaker => (
                  <img key={speaker.id} src={speaker.avatar} alt="avatar" />
                ))
              }
            </div>

        <div className={styles.names}>
          {
            room.speakers.map(speaker => (
              <div key={speaker.id} className={styles.nameWrapper}>
                <span>{speaker.name}</span>
                <img src="/images/chat-bubble.png" />
              </div>
            ))
          }
        </div>
      </div>

      <div className={styles.totalPeople}>
        <span>{room.totalPeople}</span>
        <img src="/images/user-icon.png" alt="user" />
      </div>
    </div>
  )
}

export default RoomCard
