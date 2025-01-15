import { useEffect, useState } from 'react'
import styles from "./Rooms.module.css"
import RoomCard from '../../components/RoomCard/RoomCard'
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal'
import { getAllRooms } from '../../http'

// const rooms = [
//   {
//     id: 1,
//     topic: 'which framework best for frontend',
//     speakers: [
//       {
//         id: 1,
//         name: 'john doe',
//         avatar: '/images/monkey-avatar.png'
//       },
//       {
//         id: 2,
//         name: 'john doe',
//         avatar: '/images/monkey-avatar.png'
//       }
//     ],
//     totalPeople: 40
//   },
//   {
//     id: 2,
//     topic: 'which framework best for frontend',
//     speakers: [
//       {
//         id: 1,
//         name: 'john doe',
//         avatar: '/images/monkey-avatar.png'
//       },
//       {
//         id: 2,
//         name: 'john doe',
//         avatar: '/images/monkey-avatar.png'
//       }
//     ],
//     totalPeople: 40
//   }
// ]

const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await getAllRooms();
      console.log(data)
      setRooms(data)
    }

    fetchRooms()
  }, [])


  return (
    <>
    { showModal && <AddRoomModal onClose={() => setShowModal(false)} /> }

    <div className='container'>
      <div className={styles.roomsHeader}>
        <div className={styles.left}>
          <span className={styles.heading}>All voice rooms</span>
          <div className={styles.searchBox}>
            <img src='/images/search-icon.png' alt='search' className={styles.searchIcon} />
            <input type='text' className={styles.searchInput} />
          </div>
        </div>
        <div className={styles.right}>
          <button className={styles.addRoomBtn} onClick={() => setShowModal(true)}>
            <img src='/images/add-room-icon.png' alt='' />
            <span>Start a room</span>
          </button>
        </div>
      </div>

      <div className={styles.roomList}>
        {
          rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))
        }

      </div>
    </div>
    </>
   
  )
}

export default Rooms
