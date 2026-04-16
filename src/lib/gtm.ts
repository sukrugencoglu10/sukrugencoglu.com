type WindowWithDataLayer = Window & {
  dataLayer: Record<string, any>[];
};

export const pushToDataLayer = (name: string, data: Record<string, any>) => {
  if (typeof window !== "undefined") {
    const dataLayer = (window as unknown as WindowWithDataLayer).dataLayer || [];
    dataLayer.push({
      event: name,
      ...data,
    });
    (window as unknown as WindowWithDataLayer).dataLayer = dataLayer;
  }
};

export const trackFormSubmissionGrowth = (params: {
  email: string;
  phone?: string;
  goal?: string;
  industry?: string;
  budget?: string;
  form_destination: string;
}) => {
  pushToDataLayer("form_submission_growth", params);
};

export const trackFormSubmissionPlus = (params: {
  email: string;
  phone?: string;
  service?: string;
  website?: string;
  form_destination: string;
}) => {
  pushToDataLayer("form_submission_plus", params);
};

export const trackWhatsAppClick = (params: {
  click_text: string;
  service_interest?: string;
  [key: string]: any;
}) => {
  const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
    typeof navigator !== "undefined" ? navigator.userAgent : ""
  )
    ? "mobile"
    : "desktop";

  const d = new Date();
  const day_of_week = d.getDay() === 0 ? "Pazar" : ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"][d.getDay()];
  const hour_of_day = d.getHours().toString();

  let is_first_contact = "true";
  if (typeof window !== "undefined") {
    if (localStorage.getItem("has_contacted")) {
      is_first_contact = "false";
    } else {
      localStorage.setItem("has_contacted", "true");
    }
  }

  pushToDataLayer("whatsapp_click", {
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    user_type: "anonymous",
    device_category: isMobile,
    day_of_week,
    hour_of_day,
    is_first_contact,
    ...params,
  });
};
