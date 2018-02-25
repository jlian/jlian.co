N = 100;
x = linspace(0,2*pi,N);
y = sin(x);

%% Initialization

% set up first frame
figure('Color', 'white');

% plot the 'background'
plot(x, y, 'LineWidth', 1);

% set up the markers that move
h = line(x(1),y(1),'Marker', 'o', 'MarkerSize', 5);

% set up axes size
xlim([0 2*pi]);
ylim([-2 2]);

% get figure size
pos = get(gcf, 'Position');
width = pos(3); height = pos(4);

% preallocate data (for storing frame data)
mov = zeros(height, width, 1, length(N), 'uint8');


%% Method 1: update XData and YData
for i = 1:N
	set(h, 'XData', x(i));
	set(h, 'YData', y(i));
	drawnow update
	
	% get frame as an image
    f = getframe(gcf);
    
    % create a colormap for the first frame. For the rest of the frames,
    % use the same colormap
    if i == 1
        [mov(:,:,1,i), map] = rgb2ind(f.cdata, 256, 'nodither');
    else
        mov(:,:,1,i) = rgb2ind(f.cdata, map, 'nodither');
    end
end

% Create animated GIF
imwrite(mov, map, 'animation.gif', 'DelayTime', 1/60, 'LoopCount', inf);

%%
% *Animated GIF*
%
% <<../animation.gif>>
