import { Link } from "react-router-dom";
import getParamsEnv from "../functions/getParamsEnv.js";
import React from "react";
const { ROOT, LOGIN } = getParamsEnv();

const TermsAndPrivacy = () => {
    return (
        <div className="flex flex-col">
            <header
                className="bg-white text-white py-4 h-[130px]"
                style={{
                    background: "linear-gradient(45deg, #FAD0C4, #FF9A9E, #FF6A88)",
                }}
            >
                <nav className="flex items-center justify-between mx-10">
                    <img
                        src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1702388420/aznyz3d12hy3wr3kk9j9.png"
                        className="ml-5 text-xl font-bold h-[100px] w-[100px]"
                        alt="Logo"
                    ></img>
                    <ul className="flex">
                        <li className="mx-4 text-black hover:text-secondaryColor ">
                            <Link to={ROOT}>Home</Link>
                        </li>
                        <li className="mx-4 text-black hover:text-secondaryColor ">
                            <Link to={LOGIN}>Log in</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <section
                id="terms-and-privacy"
                className=""
            >
                <div className="container text-center">
                    <h1 className="text-4xl font-bold">
                        Términos de Servicio
                    </h1>
                    <p className="mt-4">Bienvenido/a a Beauty Control, un sitio en línea que ofrece servicios estéticos. Al acceder o utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones:</p>
                    <ol>
                        <li>
                            Uso del Sitio:
                            <ol>
                                <li>
                                    a. Debes tener al menos 18 años de edad para utilizar nuestros servicios.
                                </li>
                                <li>
                                    b. Te comprometes a proporcionar información precisa y actualizada durante el proceso de registro.
                                </li>
                                <li>
                                    c. No puedes utilizar nuestros servicios con fines ilegales o no autorizados.
                                </li>
                            </ol>
                        </li>

                        <li>
                            Reserva de Servicios:
                            <ol>
                                <li>
                                    a. La reserva de servicios estéticos está sujeta a disponibilidad.
                                </li>
                                <li>
                                    b. Cancelaciones y reprogramaciones están sujetas a nuestra política de cancelación, la cual se encuentra detallada en nuestro sitio web.
                                </li>
                            </ol>
                        </li>

                        <li>
                            Pago:
                            <ol>
                                <li>
                                    a. Los precios de nuestros servicios están especificados en nuestro sitio web y pueden estar sujetos a cambios sin previo aviso.
                                </li>
                                <li>
                                    b. Los pagos se realizarán según los métodos de pago disponibles en nuestro sitio.
                                </li>
                            </ol>
                        </li>

                        <li>
                            Propiedad Intelectual:
                            <ol>
                                <li>
                                    a. Todo el contenido presente en nuestro sitio web, incluyendo texto, gráficos, logotipos, imágenes y software, está protegido por derechos de autor y otras leyes de propiedad intelectual.
                                </li>
                            </ol>
                        </li>

                        <li>
                            Limitación de Responsabilidad:
                            <ol>
                                <li>
                                    a. No nos hacemos responsables de cualquier daño directo, indirecto, incidental, especial o consecuente que pueda surgir del uso de nuestros servicios.
                                </li>
                            </ol>
                        </li>

                        <li>
                            Cambios en los Términos:
                            <ol>
                                <li>
                                    a. Nos reservamos el derecho de actualizar o modificar estos términos en cualquier momento sin previo aviso.
                                </li>
                            </ol>
                        </li>
                    </ol>
                </div>
                <div className="container text-center">
                    <h1 className="text-4xl font-bold">
                        Política de Privacidad
                    </h1>
                    <p className="mt-4">Tu privacidad es importante para nosotros. Consulta nuestra Política de Privacidad para comprender cómo recopilamos, utilizamos, comunicamos y divulgamos tus datos personales.</p>
                    <ol>
                        <li>
                            Información Recopilada:
                            <ol>
                                <li>
                                    a. Recopilamos información personal que nos proporcionas voluntariamente durante el registro y el proceso de reserva.
                                </li>
                            </ol>
                        </li>

                        <li>
                            Uso de la Información:
                            <ol>
                                <li>
                                    a. Utilizamos tu información personal para procesar reservas, mejorar nuestros servicios y enviarte información relevante.
                                </li>
                            </ol>
                        </li>

                        <li>
                            Seguridad:
                            <ol>
                                <li>
                                    a. Implementamos medidas de seguridad para proteger tu información personal y garantizar su confidencialidad.
                                </li>
                            </ol>
                        </li>

                        <li>
                            Divulgación a Terceros:
                            <ol>
                                <li>
                                    a. No compartiremos tu información personal con terceros sin tu consentimiento, excepto cuando sea necesario para proporcionar los servicios solicitados.
                                </li>
                            </ol>
                        </li>

                        <li>
                            Cookies:
                            <ol>
                                <li>
                                    a. Utilizamos cookies para mejorar la experiencia del usuario. Puedes configurar tu navegador para rechazar cookies, pero esto podría afectar la funcionalidad del sitio.
                                </li>
                            </ol>
                        </li>

                        <li>
                            Cambios en la Política de Privacidad:
                            <ol>
                                <li>
                                    a. Nos reservamos el derecho de modificar nuestra Política de Privacidad en cualquier momento. Las actualizaciones se publicarán en nuestro sitio web.
                                </li>
                            </ol>
                        </li>
                    </ol>
                    <p>Al utilizar nuestros servicios, aceptas los Términos de Servicio y la Política de Privacidad de Beauty Control.</p>
                    <p>Recuerda adaptar estos documentos según las especificaciones de tu negocio y obtener asesoramiento legal si es necesario.</p>
                </div>
            </section>
        </div>
    );
};

export default TermsAndPrivacy;
