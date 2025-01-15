import { useState } from "react";
import Button from "../../../../components/shared/Button/Button";
import Card from "../../../../components/shared/Card/Card";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import styles from "../StepPhoneEmail.module.css"

const Email = ({onNext}) => {
  const [email, setEmail] = useState('')

  return (
    <Card title="Enter your email id" icon="email-emoji">
      <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
      <div>
      <div className={styles.actionButtonWrap}>
        <Button onClick={onNext} text="Next" />
      </div>
      <p className={styles.bottomParagraph}>
        By entering your number, you're agreeing to our terms of services and Privacy Policy.
      </p>
      </div>
    </Card>
  );
};

export default Email;
