import React from "react";
import { TailSpin } from "react-loader-spinner";

const PageLoad = ({ loading }) => {
  if (!loading) return null;

  return (
    <div style={styles.backdrop}>
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="white"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
};

export default PageLoad;
