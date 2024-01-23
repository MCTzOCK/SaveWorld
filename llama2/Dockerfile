# Use python as base image
FROM python

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY ./llama_cpu_server.py /app/llama_cpu_server.py

# Install the needed packages
RUN pip install llama-cpp-python
RUN pip install Flask
RUN wget https://download.ben-siebert.com/saveworld/ai/llama/model.gguf -O /app/llama-2-7b-chat.Q2_K.gguf

# Expose port 5000 outside of the container
EXPOSE 5000

# Run llama_cpu_server.py when the container launches
CMD ["python", "llama_cpu_server.py"]
