
import Button from "../../components/Buttons/Button";
import useContainer from "./useContainer";
import MainLayout from "../../layout/Main";
import { colors } from "../../utils/theme/color";

const Home = () => {
    const { modalStateHandler } = useContainer()

    return (
        <MainLayout>

            <div className="fixed z-20 bottom-10 right-10 flex flex-col items-end gap-2 ">
                <Button
                    label="Join Lobby"
                    textColor={colors.purple}
                    bgColor={colors.white}
                    loading={false}
                    onClick={() => modalStateHandler('joinLobby')}
                />
                <Button
                    label="Create Lobby"
                    textColor={colors.pink}
                    bgColor={colors.white}
                    loading={false}
                    onClick={() => modalStateHandler('createLobby')}

                />
            </div>


        </MainLayout>
    );
};

export default Home;
