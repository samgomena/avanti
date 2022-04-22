const FormError: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="invalid-feedback" style={{ display: "block" }}>
    {children}
  </div>
);

export default FormError;
