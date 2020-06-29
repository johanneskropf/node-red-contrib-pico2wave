module.exports = function(RED) {
    const { exec } = require("child_process");
    const fs = require("fs");
    
    function Pico2WaveNode(config) {
        RED.nodes.createNode(this,config);
        this.fileId = "";
        this.filePath = "";
        this.outputToFile = config.outputToFile;
        this.manualPath = config.manualPath;
        this.language = config.language;
        this.pico2waveCommand = "";
        this.shm = true;
        this.checkPath = true;
        var node = this;
        
        function node_status(state1 = [], timeout = 0, state2 = []){
            
            if (state1.length !== 0) {
                node.status({fill:state1[1],shape:state1[2],text:state1[0]});
            } else {
                node.status({});
            }
            
            if (node.statusTimer !== false) {
                clearTimeout(node.statusTimer);
                node.statusTimer = false;
            }
            
            if (timeout !== 0) {
                node.statusTimer = setTimeout(() => {
                
                    if (state2.length !== 0) {
                        node.status({fill:state2[1],shape:state2[2],text:state2[0]});
                    } else {
                        node.status({});
                    }
                    
                    node.statusTimer = false;
                    
                },timeout);
            }
            
        }
        
        node_status();
        
        node.fileId = node.id.replace(/\./g,"");
        
        if (!fs.existsSync('/dev/shm')) { node.shm = false; }
        
        if (node.outputToFile === "file" && !node.manualPath) {
            node.error("did you forget to enter a file path? bing bing");
            node_status(["file path error","red","dot"]);
            node.checkPath = false;
        } else if (node.outputToFile === "file") {
            node.filePath = node.manualPath + ".wav";
        } else {
            node.filePath = (node.shm) ? "/dev/shm/" + node.fileId + ".wav" : "/tmp/" + node.fileId + ".wav";
        }
        
        node.pico2waveCommand = "pico2wave -w " + node.filePath + " -l " + node.language;
        
        node.on('input', function(msg, send, done) {
            
            const command = node.pico2waveCommand + " \"" + msg.payload + "\"";
            
            node.pico2wave = exec(command, (error, stdout, stderr) => {
                if (error) {
                    node_status(["error","red","dot"]);
                    (done) ? done(error) : node.error(error);
                    return;
                }
                if (stderr) {
                    node_status(["error","red","dot"]);
                    (done) ? done(stderr) : node.error(stderr);
                    return;
                }
                switch (node.outputToFile){
                    case "file":
                        msg.payload = node.filePath
                        send(msg);
                        node_status(["tts generation done","green","dot"],1500);
                        break;
                        
                    case "buffer":
                        msg.payload = fs.readFileSync(node.filePath);
                        send(msg);
                        node_status(["tts generation done","green","dot"],1500);
                        break;
                }
                done();
                return;
            });
            
        });
        
        node.on("close",function() {
        
            node_status();
            
            const checkDir = (node.shm) ? "/dev/shm/" : "/tmp/";
            fs.readdir(checkDir, (err,files) => {
                if (err) { node.error("couldnt check for leftovers in " + checkDir); return; }
                files.forEach(file => {
                    if (file.match(node.fileId)) {
                        try {
                            fs.unlinkSync(checkDir + file);
                        } catch (error) {
                            node.error("couldnt delete leftover " + file);
                        }
                    }
                });
                return;
            });
            
            if(node.pico2wave) {
                node.pico2wave.kill();
            }
            
        });
        
    }
    
    RED.nodes.registerType("pico2wave",Pico2WaveNode);
}