export default function RadioButton({ name, value, text, onChange }) {
  return (
    <label className="radio-button-field-wrapper w-radio">
        <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
        <input type="radio" name={name} value={value} />
        <span className="text-300 w-form-label">{text}</span>
    </label>
  );
}
