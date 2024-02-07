//
//  pixed.c
//  
//
//  Created by Edward Kish on 1/9/24.
//eval cc pixed.c -framework IOKit -framework Cocoa -framework OpenGL $(pkg-config --libs --cflags raylib) -o Pixed

#include <stdio.h>
#include <raylib.h>

void drawColorPicker() {
    DrawRectangle(700, 100, 75, 50, RED);
    DrawRectangle(800, 100, 75, 50, ORANGE);
    
    DrawRectangle(700, 175, 75, 50, YELLOW);
    DrawRectangle(800, 175, 75, 50, GREEN);
    
    DrawRectangle(700, 250, 75, 50, BLUE);
    DrawRectangle(800, 250, 75, 50, PURPLE);
}

void pickColor(int x, int y, Color *selected) {
    // Left col
    if (x >= 700 && x <= 775) {
        if (y >= 100 && y <= 175){
            *selected = RED;
            return;
        }
        if (y >= 175 && y <= 225) {
            *selected = YELLOW;
            return;
        }
        if (y >= 250 && y <= 325) {
            *selected = BLUE;
            return;
        }
    } // Right col
    else if (x >= 800 && x <= 875) {
        if (y >= 100 && y <= 175){
            *selected = ORANGE;
            return;
        }
        if (y >= 175 && y <= 225) {
            *selected = GREEN;
            return;
        }
        if (y >= 250 && y <= 325) {
            *selected = PURPLE;
            return;
        }
    }
}

int main(void)
{
    // Initialization
    //--------------------------------------------------------------------------------------
    char *filename = "Untitled";
    const int screenWidth = 900;
    const int screenHeight = 800;
    const int img_len = 64;
    const int img_size = 64 * 64;
    const int scale = 10;
    Color image_data[img_size];
    Color selected_color = RED;
    for (int i = 0; i < img_size; i++){
        image_data[i] = BLANK;
    }

    InitWindow(screenWidth, screenHeight, "Pixed - Untitled");
    
    int frameCounter = 0;

    SetTargetFPS(600);               // Set our game to run at 60 frames-per-second
    //--------------------------------------------------------------------------------------
    printf("Running!\n");
    // Main game loop
    while (!WindowShouldClose())    // Detect window close button or ESC key
    {
        // Update
        //----------------------------------------------------------------------------------
        // TODO: Update your variables here
        if (IsMouseButtonDown(MOUSE_BUTTON_LEFT)){
            
            Vector2 location = GetMousePosition();
            int x = location.x;
            int y = location.y;
            if (x >= 700) {
                pickColor(x, y, &selected_color);
            }
            int xidx = x/scale;
            int yidx = y/ scale;
            if (xidx >= 0 && yidx >= 0 && xidx < img_len && yidx < img_len) {
                
                image_data[xidx + img_len*yidx] = selected_color;
            }
        }

        //----------------------------------------------------------------------------------

        // Draw
        //----------------------------------------------------------------------------------
        BeginDrawing();

            ClearBackground(LIGHTGRAY);
        drawColorPicker();
            DrawRectangle(0, 0, scale * img_len, scale * img_len, WHITE);
        for (int x = 0; x < img_len; x++){
            for (int y = 0; y < img_len; y++){
                DrawRectangle(x*scale,y*scale, scale, scale, image_data[x + y*img_len]);
            }
        }

        EndDrawing();
        //----------------------------------------------------------------------------------
    }

    // De-Initialization
    //--------------------------------------------------------------------------------------
    CloseWindow();        // Close window and OpenGL context
    //--------------------------------------------------------------------------------------

    return 0;
}
