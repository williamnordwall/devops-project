import random
from sre_parse import WHITESPACE
import sys
import time
import pygame
from pygame.locals import *

# Window size for the game
windowWidth = 1000
windowHeight = 800
# Set the size for the window
window = pygame.display.set_mode((windowWidth, windowHeight))
# Global variable for moving background
xB = 0
#Map for all images
images = { }
#Map for all sounds
sounds = { }
#How fast the game will be
fps = 60
#Score numbers
score = 0
highscore = 0

blue = (0, 0, 255)
white = (255, 255, 255)
pink = (255, 112, 112)

def text_objects(text, font):
    textSurface = font.render(text, True, pink)
    return textSurface, textSurface.get_rect()

def startMenu():
    background = pygame.image.load('images/background.png').convert()
    while True:
        for event in pygame.event.get():
            if event.type == KEYDOWN and event.key == K_ESCAPE:
                pygame.quit()
                sys.exit()
            if event.type == KEYDOWN and event.key == K_SPACE:
                return True

        window.blit(background, (0, 0))
        Font = pygame.font.Font('freesansbold.ttf', 50)
        text1, textFont1 = text_objects("Welcome to Jetswim Octopus", Font)
        text2, textFont2 = text_objects("Press spacebar to start", Font)
        textFont1.center = ((windowWidth/2),(windowHeight/3))
        textFont2.center = ((windowWidth/2),(windowHeight/2))
        window.blit(text1, textFont1)
        window.blit(text2, textFont2)
        pygame.display.update()
        fpsClock.tick(fps)
        

def swimgame():
    xPos = int(windowWidth/5)
    yPos = int(windowHeight/3.5)
    tempHeight = 100

    pipe1 = createObstacle()
    pipe2 = createObstacle()

    lowerPipes = [
            {'x': windowWidth+300-tempHeight, 'y': pipe1[1]['y']},
            {'x': windowWidth+400-tempHeight+windowWidth/2, 'y': pipe2[1]['y']}
    ]
    upperPipes = [
            {'x': windowWidth+300-tempHeight, 'y': pipe1[0]['y']},
            {'x': windowWidth+300-tempHeight+windowWidth/2, 'y': pipe2[0]['y']}
    ]

    # obstacle velocity
    pipeVelocity = -5

    #octopus velocity
    octopusVelocity = -9
    maxVelocity = 10
    octoAccy = 1

    flapVelocity = -12
    
    octoSwim = False

    ind = 0

    while True:
        for event in pygame.event.get():
            if event.type == QUIT or (event.type == KEYDOWN and event.key == K_ESCAPE):
                pygame.quit()
                sys.exit()
            if event.type == KEYDOWN and event.key == K_SPACE:
                if yPos > 0:
                    octopusVelocity = flapVelocity
                    octoSwim = True
                    if ind >= 2:
                        ind = 0
                    ind += 1
                    sounds['swim'].play()

        if gameOver(xPos, yPos, upperPipes, lowerPipes):
            return
        
        # Update score and increases the speed every 10 point
        global score
        playerPos = xPos
        for pipe in upperPipes:
            pipePos = pipe['x'] + images['obstacle'][0].get_width()/2
            if pipePos <= playerPos < pipePos + 4:
                score += 1
                sounds['score'].play()
                if score % 10 == 0:
                    global fps
                    fps += 20

        if octopusVelocity < maxVelocity and not octoSwim:
            octopusVelocity += octoAccy

        if octoSwim:
            octoSwim = False 
        playerHeight = images['octopus'][0].get_height()
        yPos = yPos + \
            min(octopusVelocity, windowHeight - yPos - playerHeight)

        # Moves pipes left
        for pipe in upperPipes:
            pipe['x'] += pipeVelocity
        for pipe in lowerPipes:
            pipe['x'] += pipeVelocity

        # Add new pipes to the list when one is about to leave the screen
        if -1 < upperPipes[0]['x'] < 5:
            newPipe = createObstacle()
            upperPipes.append(newPipe[0])
            lowerPipes.append(newPipe[1])

        # Remove pipe from list if it has left the screen
        if upperPipes[0]['x'] < -images['obstacle'][0].get_width():
            upperPipes.pop(0)
            lowerPipes.pop(0)

        # Blit all the images on the screen

        #Moving background
        global xB
        relX = xB % background.get_rect().width
        window.blit(background, (relX - background.get_rect().width, 0))
        if relX < windowWidth:
            window.blit(background, (relX, 0))
        xB -= 1

        for pipe in upperPipes:
            window.blit(images['obstacle'][0], (pipe['x'], pipe['y']))
        for pipe in lowerPipes:
            window.blit(images['obstacle'][1], (pipe['x'], pipe['y']))

        window.blit(images['octopus'][ind], (xPos, yPos))

        # Get the score images
        scoreList = list(str(score))

        # Display the score
        x = 900
        y = 50
        for number in scoreList:
            window.blit(images['scoreNumbers'][int(number)], (x, y))
            x += 35

        pygame.display.update()
        fpsClock.tick(fps)

# GameOver() function which represents whether the octopus has hit the pipes
def gameOver(octoX, octoY, topObstacles, downObstacles):
    
    # Checks if Octopus collides with upper obstacle
    for obstacle in topObstacles:
        obstacleHeight = images['obstacle'][0].get_height()
        if(octoY + 90 < obstacleHeight + obstacle['y'] 
        and abs(octoX - obstacle['x']*2) < images['obstacle'][0].get_width()):
            sounds['die'].play()
            return True
    
    # Checks if Octopus collides with lower obstacle
    for obstacle in downObstacles:
        if(octoY - 90 + images['octopus'][0].get_height() > obstacle['y'] 
        and abs(octoX - obstacle['x']*2) < images['obstacle'][0].get_width()):
            sounds['die'].play()
            return True

    return False

def createObstacle():
    #gap between two obstacles
    gap = windowHeight/4
    obstacleHeight = images['obstacle'][0].get_height()

    # Y coordinate for bottom obstacle
    bottomY = gap + random.randrange(0, windowHeight - 1.2 * gap)
    # X coordinate for obstacles
    coordinateX = windowWidth * 1.5
    # Y coordinate for top obstacle
    topY = obstacleHeight - bottomY + gap
    obstacle = [ {'x': coordinateX, 'y': - topY}, 
                {'x': coordinateX, 'y': bottomY} ]
    return obstacle

# where the game starts
if __name__ == "__main__":

    # Initializing modules of pygame library
    pygame.init()
    fpsClock = pygame.time.Clock()

    pygame.display.set_caption('Jetswim Octopus')

    startMenu()

    # Score images
    images['scoreNumbers'] = (
            pygame.image.load('images/0.png').convert_alpha(),
            pygame.image.load('images/1.png').convert_alpha(),
            pygame.image.load('images/2.png').convert_alpha(),
            pygame.image.load('images/3.png').convert_alpha(),
            pygame.image.load('images/4.png').convert_alpha(),        
            pygame.image.load('images/5.png').convert_alpha(),
            pygame.image.load('images/6.png').convert_alpha(),
            pygame.image.load('images/7.png').convert_alpha(),
            pygame.image.load('images/8.png').convert_alpha(),
            pygame.image.load('images/9.png').convert_alpha()
        )
    # Images of the octopus
    images['octopus'] = (
        pygame.image.load('images/octo1.png').convert_alpha(),
        pygame.image.load('images/octo2.png').convert_alpha(),
        pygame.image.load('images/octo3.png').convert_alpha()
    )
    # Background Image        
    background = pygame.image.load('images/background.png').convert()
    # Obstacle Images one rotated upside down, will probably also need resizing
    images['obstacle'] = (pygame.transform.rotate(pygame.image.load('images/obstacle.png').convert_alpha(),180),pygame.image.load('images/obstacle.png').convert_alpha())
    
    # Sound files
    sounds['swim'] = pygame.mixer.Sound('audio/swim.wav')
    sounds['die'] = pygame.mixer.Sound('audio/die.wav')
    sounds['score'] = pygame.mixer.Sound('audio/score.wav')
    sounds['highscore'] = pygame.mixer.Sound('audio/highscore.wav')

    # Instructions in command line
    print("JETSWIM OCTOPUS")
    print("Press space or enter to start the game")

    while True:

        # Starting coordinates for the octopus
        horizontal = int(windowWidth/5)
        vertical = int(windowHeight/3.5)

        while True:
            for event in pygame.event.get():

                # Closes the game if the user clicks the "close" button
                if event.type == QUIT or (event.type == KEYDOWN and event.key == K_ESCAPE):
                    pygame.quit()

                    # Closes the window
                    sys.exit()

                # Starts the game if user presses space
                elif event.type == KEYDOWN and (event.key == K_SPACE):
                    swimgame()
                
                # While the user has not pressed any key
                else:
                    #Reset speed
                    fps = 60
                    window.blit(background, (0, 0))

                    Font = pygame.font.Font('freesansbold.ttf', 50)
                    text2, textFont2 = text_objects("Press spacebar to swim", Font)
                    text3, textFont3 = text_objects("Your score:", Font)
                    text4, textFont4 = text_objects("Highscore:", Font)
                    textFont2.center = ((windowWidth/2),(windowHeight/2))
                    textFont3.center = (750,95)
                    textFont4.center = (175,95)
                    window.blit(text2, textFont2)
                    window.blit(text3, textFont3)
                    window.blit(text4, textFont4)
                    pygame.display.update()
                    fpsClock.tick(fps)
                    window.blit(images['octopus'][1], (horizontal, vertical))
                    
                    result = score
                    #Reset score
                    score = 0
                    scoreList = list(str(result))
                    # Display the score
                    x = 900
                    y = 50
                    for number in scoreList:
                        window.blit(images['scoreNumbers'][int(number)], (x, y))
                        x += 35
                    
                    if result > highscore:
                        sounds['highscore'].play()
                        highscore = result
                    
                    
                    highScoreList = list(str(highscore))

                    # Display the highscore
                    x1 = 320
                    y1 = 50
                    for number in highScoreList:
                        window.blit(images['scoreNumbers'][int(number)], (x1, y1))
                        x1 += 35

                # Refreshes Screen
                pygame.display.update()

                # Framerate (Speed of the game)
                fpsClock.tick(fps)