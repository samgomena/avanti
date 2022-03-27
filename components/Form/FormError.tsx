const FormError: React.FC = ({ children }) => (
  <div className="invalid-feedback" style={{ display: "block" }}>
    {children}
  </div>
);

export default FormError;
