import openai
import re
import hotkey_tv.settings as settings
# Set up the OpenAI API client

import os

def load_api_key():
    file_name = 'open-ai-key.txt'  # Replace with the actual file name
    file_path = os.path.join(settings.BASE_DIR, file_name)
    
    if os.path.isfile(file_path):  # Verify if the file exists
        with open(file_path, 'r') as file:
            file_content = file.read()
            openai.api_key = file_content.strip('\n')
            print("got key!: "+openai.api_key)
    else:
        print("FAILED TO GET KEY")

def main():
    load_api_key()
    print("The following prompt will be used:\n\n")
    prompt = """
Prompt
Please use variations of these Notes to help generate the reply to the message above:
blah blah blah
"""
    print(prompt)
    advance(prompt)

def send_prompt(prompt):
#    pattern = r'\d+[ ](?:[A-Za-z0-9.-]+[ ]?)+(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Dr|Rd|Blvd|Ln|St)\.?'
#    if re.match(pattern,prompt, re.IGNORECASE):
#        print("ADDRESS DETECTED. ENDING SEQUENCE")
#        return
    print ("Sending:"+prompt)
    model_engine = "text-davinci-003"
    # Generate a response
    completion = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=16,
        n=1,
        stop=None,
        temperature=0.5,
        top_p=1,
        frequency_penalty=0.5,
        presence_penalty=0.5
    )
    print("compltion;"+str(completion))
    response = completion.choices[0].text
    print("Res:"+response)
    return response
#    print("Chat says:\n\n:"+response+"\n\n")
#    next_prompt = input("Your Reply: ")
#    advance(next_prompt)

if __name__ == "__main__":
    main()


load_api_key()

