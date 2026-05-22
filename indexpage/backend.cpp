#include <iostream>
#include <string>
#include <thread>
#include <chrono>

using namespace std;

class HRZWelcomeScreen {

private:

    string appName;
    string version;
    bool systemActive;

public:

    // Constructor
    HRZWelcomeScreen() {

        appName = "HEART RATE ZONE CALCULATOR";
        version = "HRZ V2.0";
        systemActive = true;
    }

    // Top Console Bar
    void showConsoleHeader() {

        cout << "=========================================================\n";

        cout << version;

        cout << "        CARDIAC MONITOR | STATUS : ";

        if(systemActive) {

            cout << "ACTIVE";

        } else {

            cout << "OFFLINE";
        }

        cout << "\n";

        cout << "=========================================================\n\n";
    }

    // Loading Animation
    void loadingSystem() {

        cout << "Initializing Heart Monitor System";

        for(int i=0; i<5; i++) {

            cout << ".";

            this_thread::sleep_for(
                chrono::milliseconds(400)
            );
        }

        cout << "\n\n";
    }

    // Main Title
    void displayTitle() {

        cout << "=========================================\n";
        cout << "         HEART RATE\n";
        cout << "      ZONE CALCULATOR\n";
        cout << "=========================================\n\n";

        cout << "Calculate your optimal heart rate zones\n";
        cout << "based on exercise and workout intensity.\n\n";
    }

    // Zone Information
    void showZones() {

        cout << "--------------- HEART RATE ZONES ---------------\n\n";

        cout << "Zone 1 : Very Light   (50% - 60%)\n";
        cout << "Zone 2 : Light        (60% - 70%)\n";
        cout << "Zone 3 : Moderate     (70% - 80%)\n";
        cout << "Zone 4 : Hard         (80% - 90%)\n";
        cout << "Zone 5 : Maximum      (90% - 100%)\n\n";
    }

    // Formula Display
    void showFormula() {

        cout << "Maximum Heart Rate Formula:\n";
        cout << "220 - Age\n\n";
    }

    // Start Button Simulation
    void startApplication() {

        cout << "=========================================\n";
        cout << "             START SYSTEM\n";
        cout << "=========================================\n\n";

        cout << "Opening Input Page...\n";

        this_thread::sleep_for(
            chrono::milliseconds(1500)
        );

        cout << "Input Page Loaded Successfully!\n";
    }

};

/* MAIN PROGRAM */

int main() {

    HRZWelcomeScreen screen;

    screen.showConsoleHeader();

    screen.loadingSystem();

    screen.displayTitle();

    screen.showZones();

    screen.showFormula();

    screen.startApplication();

    cout << "\nProgram Executed Successfully!\n";

    return 0;
}