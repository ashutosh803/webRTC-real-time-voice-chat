import Card from '../../../components/shared/Card/Card'
import TextInput from '../../../components/shared/TextInput/TextInput'
import styles from "./StepOtp.module.css"
import Button from '../../../components/shared/Button/Button'
import { useRef, useState } from 'react'
import { verifyOtp } from '../../../http'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '../../../store/authSlice'

const StepOtp = () => {
  const [otp, setOtp] = useState('')
  const { phone, hash } = useSelector((state) => state.auth.otp)
  const dispatch = useDispatch()
  const inputRefs = Array.from({ length: 4 }, () => useRef(null))

  const submit = async () => {
    if(!otp || otp.length < 4 || !phone || !hash){
      return
    }

    try{
      const { data } = await verifyOtp({otp, phone, hash })
      dispatch(setAuth({ user: data.user }))
      console.log(data)
    } catch(err){
      console.log(err)
    }
  }

  const moveToNextInput = (e,idx) => {
    const input = e.target
    if(input.value.length > 1){
      input.value = input.value.slice(0, 1)
    }
    else if(input.value.length === 1){
      if(idx + 1 < 4) input.parentElement.children[idx + 1].focus()
    }
    else {
      if(idx - 1 >= 0){
        input.parentElement.children[idx - 1].focus()
      }
    }
    const otpNum = inputRefs.map((ref)=> ref.current.value).join('');
    setOtp(otpNum)
}

  return (
    <div className={styles.cardWrapper}>
        <Card title="Enter the code we just texted you" icon="lock-emoji">
      <TextInput value={otp} onChange={(e) => setOtp(e.target.value)} />
      <div style={{display:'flex', gap:'1rem'}}>
        { Array.from({length: 4}).map((_, idx) => {
        return <input ref={inputRefs[idx]} key={idx} onInput={(e)=>moveToNextInput(e,idx)} type="text" style={{ width: '30px',
          height:'30px', textAlign:'center'}} />
        } )}
      </div>
      <div>
      <div className={styles.actionButtonWrap}>
        <Button onClick={submit} text="Next" />
      </div>
      <p className={styles.bottomParagraph}>
        By entering your number, you're agreeing to our terms of services and Privacy Policy.
      </p>
      </div>
    </Card>
    </div>
  
  )
}


export default StepOtp
