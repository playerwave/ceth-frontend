const main_admin = () => {
  const dev_api_end_point = import.meta.env.VITE_DEV_API_URL;
  const prod_api_end_point = import.meta.env.VITE_PROD_API_URL;

  return (
    <div className="font-pt-sans ml-50">
      <h1>Main Admin</h1>
      <h1>{typeof dev_api_end_point} : {dev_api_end_point}</h1>
      <h1>{typeof prod_api_end_point} : {prod_api_end_point}</h1>
    </div>
  );
};

export default main_admin;
